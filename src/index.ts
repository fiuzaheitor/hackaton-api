import express from "express";
import http from "http";
import { startApolloServer } from "./server/apollo";
import cors from "cors";
import { Consultations } from "./models/Consultation";
import { Gestations } from "./models/Gestation";
import { Users } from "./models/User";

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
  const getConsultationType = (week: any) => {
    if (week >= 16 && week <= 20) return "segunda";
    if (week >= 24 && week <= 28) return "terceira";
    if (week > 28 && week <= 32) return "quarta";
    if (week > 32 && week <= 36) return "quinta";
    if (week === 36) return "sexta";
    if (week === 37) return "setima";
    if (week === 38) return "oitava";
    if (week === 39) return "nona";
    if (week === 40) return "decima";
    if (week === 41) return "decimaPrimeira";
    return "default";
  };

  try {
    const consultations = await Consultations.find();
    const messages = JSON.parse(await fs.readFile('./src/consultationMessages.json', 'utf-8'));

    const calculateDifference = (date: any) => {
      const currentDate: any = new Date();
      const consultationDate: any = new Date(date);
      return Math.ceil((consultationDate - currentDate) / (1000 * 3600 * 24));
    };

    const filteredConsultations = consultations.filter(
      (consultation) => calculateDifference(consultation.date) <= 7
    );

    for (const consultation of filteredConsultations) {
      const consultationType = getConsultationType(consultation.week);
      const messageBody = messages.consultations[consultationType]?.message || "Mensagem padrão: Lembrete de consulta.";

      try {
        const gestation: any = await Gestations.findById(consultation.gestation);
        const user: any = await Users.findById(gestation.user);

        await sendMessage(
          `Olá, ${user?.name}! ${messageBody}\nEla acontecerá no dia ${new Date(
            consultation.date
          ).toLocaleDateString("pt-br", { day: "numeric", month: "numeric", year: "numeric" })}, daqui ${calculateDifference(
            consultation.date
          )} dias, aguardamos sua presença!`,
          "6384496743"
        );
      } catch (error) {
        console.error("Erro ao enviar mensagem para consulta:", error);
      }
    }
  } catch (error) {
    console.error("Erro ao processar as consultas:", error);
  }
};


cron.schedule('26 7 * * *', sendMessagesToAllNecessities, {
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
