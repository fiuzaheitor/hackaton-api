import express from "express";
import http from "http";
import { startApolloServer } from "./server/apollo";
import cors from "cors";
import { sendMessagesToAllNecessities } from "./services/consultationServices";
import { sendMessage } from "./services/messageService";

const app = express();
const httpServer = http.createServer(app);

const cron = require('node-cron');
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.post("/send-message", async (req, res) => {
  const { message, phone } = req.body;
  try {
    await sendMessage(message, phone);
    res.status(200).json({ message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar mensagem!" });
  }
})

cron.schedule('58 11 * * *', sendMessagesToAllNecessities, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
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
