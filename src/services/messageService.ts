import { client } from "../server/twilio";

export const sendMessage = async (message: string, phone: string) => {
  try {
    const response = await client.messages.create({
      from: "whatsapp:+14155238886",
      body: message,
      to: `whatsapp:+55${phone}`,
    });
    console.log(response.sid);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};
