import express from "express";
import http from "http";
import { startApolloServer } from "./server/apollo";
import cors from "cors";
import { Consultations } from "./models/Consultation";

const app = express();
const httpServer = http.createServer(app);

const accountSid = 'ACa9f6221afee55850af4dd9a2f937eed4';
const authToken = '08faa2d65bf0121167d2580aac124055';
const client = require('twilio')(accountSid, authToken);
const cron = require('node-cron');
require("dotenv").config();

app.use(cors());
app.use(express.json());

const sendMessage = async (message: string, phone: string) => {
  try{
    client.messages
        .create({
          from: 'whatsapp:+14155238886',
          body: message,
          to: `whatsapp:+55${phone}`,
      })
      .then((messageResponse: any) => console.log(messageResponse.sid))
      .catch((error: any) => console.error(error));
  } catch (error) {
    console.error(error);
  }
}

const fs = require('fs').promises; // Importar o módulo fs para leitura de arquivos

const sendMessagesToAllNecessities = async () => {
  try {
    const consultations = await Consultations.find();
    const messages = JSON.parse(await fs.readFile('consultationMessages.json', 'utf-8')); // Ler o arquivo JSON
    const calculateDifference = (date: any) => {
      const currentDate = new Date();
      const consultationDate = new Date(date);
      const difference = consultationDate.getTime() - currentDate.getTime();
      const days = Math.ceil(difference / (1000 * 3600 * 24));
      return days;
    };

    const filteredConsultations = consultations.filter((consultation) => {
      return calculateDifference(consultation.date) <= 7;
    });

    filteredConsultations.map((consultation: any) => {
      // Obter a mensagem baseada no tipo de consulta
      const consultationType = consultation.type.toLowerCase(); // Converter o tipo para minúsculas
      const messageBody = messages.consultations[consultationType]?.message || "Mensagem padrão: Lembrete de consulta.";
      
      // Enviar a mensagem
      sendMessage(
        `Olá, ${consultation?.gestation?.user?.name}! ${messageBody}\nEla acontecerá no dia ${new Date(consultation.date).toLocaleDateString("pt-br", {day: "numeric", month: "numeric", year: "numeric"})}, daqui ${calculateDifference(consultation.date)} dias, aguardamos sua presença!`,
        consultation.gestation.user.phone
      );
    });
  } catch (error) {
    console.error(error);
  }
};

cron.schedule('0 5 * * *', sendMessagesToAllNecessities, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

app.post("/send-message", async (req, res) => {
  const { message, phone } = req.body; // Desestruturar o corpo da requisição
  try {
    await sendMessage(message, phone); // Esperar o envio da mensagem
    res.status(200).send({ status: 'Mensagem enviada com sucesso!' }); // Retornar uma resposta
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao enviar a mensagem.' }); // Retornar erro
  }
});


async function startServer() {
  await startApolloServer(app, httpServer);
  const port = (process.env.PORT as string) || 4000;
  await new Promise<void>((resolve) =>
    httpServer.listen(port, () => resolve()),
  );
  console.log(`Servidor disponível em https://localhost:${port}/graphql`);
}
startServer();
