import { Consultations } from "../models/Consultation";
import { Gestations } from "../models/Gestation";
import { Users } from "../models/User";
import { Vaccines, VaccineTemplates } from "../models/Vaccine";
import { VaccineCards } from "../models/VaccineCard";
import { calculateDifference } from "../util/dateUtils";
import { sendMessage } from "./messageService";

const fs = require("fs").promises;

export const sendMessagesToAllNecessities = async () => {
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
    const vaccines = await Vaccines.find();
    const messages = JSON.parse(
      await fs.readFile("./src/consultationMessages.json", "utf-8"),
    );

    const filteredConsultations = consultations.filter(
      (consultation: any) => calculateDifference(consultation.date) <= 7,
    );

    const filteredVaccines = vaccines.filter(
      (vaccine: any) =>
        calculateDifference(vaccine.date) <= 7 && !vaccine.isFinished,
    );

    for (const consultation of filteredConsultations as any[]) {
      const consultationType = getConsultationType(consultation.week);
      const messageBody =
        messages.consultations[consultationType]?.message ||
        "Mensagem padrão: Lembrete de consulta.";

      try {
        const gestation: any = await Gestations.findById(
          consultation.gestation,
        );
        const user: any = await Users.findById(gestation.user);

        await sendMessage(
          `${messageBody}\nEla acontecerá no dia ${new Date(
            consultation.date,
          ).toLocaleDateString("pt-br", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}, daqui ${calculateDifference(
            consultation.date,
          )} dias, aguardamos sua presença!`,
          "6384496743",
        );
      } catch (error) {
        console.error("Erro ao enviar mensagem para consulta:", error);
      }
    }
    for (const vaccine of filteredVaccines as any[]) {
      try {
        const vaccineCard: any = await VaccineCards.findById(
          vaccine.vaccineCard,
        );
        const vaccineTemplate: any = await VaccineTemplates.findById(
          vaccine.vaccineTemplate,
        );
        const user: any = await Users.findById(vaccineCard.user);

        await sendMessage(
          `Olá ${user.name}, seu filho(a) tem uma vacina de ${vaccine?.vaccineTemplate?.name} marcada para o dia ${new Date(
            vaccine.date,
          ).toLocaleDateString("pt-br", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}, daqui ${calculateDifference(
            vaccine.date,
          )}, tal vacina tem como descrição: "${vaccine?.description}" dias, não esqueça!`,
          "6384496743",
        );
      } catch (error) {
        console.error("Erro ao enviar mensagem para vacina:", error);
      }
    }
  } catch (error) {
    console.error("Erro ao processar as mensagens: ", error);
  }
};
