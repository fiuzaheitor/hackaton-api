import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

interface VaccineData {
  name: string;
  birthDate: string;
  vaccines: { name: string; date: string }[];
}

const createVaccineCardPdf = async (jsonFile: string, outputPdf: string) => {
    const data: VaccineData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([594, 420]); 
    const { width, height } = page.getSize();

    page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(0, 0, 0), 
    });

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    page.drawText('Cartão de Vacinação', {
        x: 50,
        y: height - 70,
        size: 24,
        font: timesBoldFont,
        color: rgb(0, 0, 0),
    });
 
    page.drawText(`Nome: ${data.name}`, {
        x: 50,
        y: height - 110,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Data de Nascimento: ${data.birthDate}`, {
        x: 50,
        y: height - 130,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    page.drawLine({
        start: { x: 50, y: height - 150 },
        end: { x: width - 50, y: height - 150 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });

    const tableYStart = height - 170;
    page.drawText('Vacina', { x: 50, y: tableYStart, size: 12, font: timesBoldFont });
    page.drawText('Data', { x: 200, y: tableYStart, size: 12, font: timesBoldFont });

    let currentY = tableYStart - 20;

 
    data.vaccines.forEach((vaccine: { name: string; date: string }) => {
        page.drawText(vaccine.name, { x: 50, y: currentY, size: 12, font: timesRomanFont });
        page.drawText(vaccine.date, { x: 200, y: currentY, size: 12, font: timesRomanFont });

        page.drawLine({
            start: { x: 50, y: currentY - 5 },
            end: { x: width - 50, y: currentY - 5 },
            thickness: 0.5,
            color: rgb(0.8, 0.8, 0.8),
        });

        currentY -= 30;
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPdf, pdfBytes);
};

createVaccineCardPdf('data.json', 'cartao_vacinacao.pdf')
    .then(() => console.log('PDF gerado com sucesso!'))
    .catch((error) => console.error('Erro ao gerar PDF:', error));
