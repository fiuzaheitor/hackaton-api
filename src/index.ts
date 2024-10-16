import express from "express";
import http from "http";
import { startApolloServer } from "./server/apollo";
import cors from "cors";

const app = express();
const httpServer = http.createServer(app);

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body;
  const msg = {
    to: email,
    from: 'heitorfiuzabr@gmail.com', 
    subject: subject,
    text: message,
    html: `<strong>${message}</strong>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
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
