import express from "express";
import http from "http";
import { startApolloServer } from "./server/apollo";
import cors from "cors";

const app = express();
const httpServer = http.createServer(app);

const accountSid = 'ACa9f6221afee55850af4dd9a2f937eed4';
const authToken = '08faa2d65bf0121167d2580aac124055';
const client = require('twilio')(accountSid, authToken);
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.post("/send-message", async (req, res) => {
  client.messages
      .create({
          from: 'whatsapp:+14155238886',
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
          contentVariables: '{"1":"12/1","2":"3pm"}',
          to: 'whatsapp:+556384496743'
      })
      .then((message: any) => console.log(message.sid))
      .done();
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
