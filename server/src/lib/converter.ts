import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import libre from "libreoffice-convert";
import sharp from "sharp";
import PDFDocument from "pdfkit";

export const convertOfficeToPDF = async (inputPath: string, outputPath: string) => {
  try {
    const inputBuf = await fs.readFile(inputPath);

    await new Promise<void>((resolve, reject) => {
      libre.convert(
        inputBuf,
        ".pdf",
        undefined,
        async (err: any, done: Buffer) => {
          if (err) {
            console.error("LibreOffice conversion error:", err);
            return reject(err);
          }

          try {
            await fs.writeFile(outputPath, done);
            resolve();
          } catch (writeErr) {
            reject(writeErr);
          }
        },
      );
    });
  } catch (err) {
    console.error("convertOfficeToPDF failed:", err);
    throw err;
  }
};

export const convertPDFToOffice = async (
  inputPath: string,
  outputPath: string,
  format: string,
) => {
  try {
    const inputBuf = await fs.readFile(inputPath);
    const ext = format === "doc" ? ".doc" : ".docx";

    await new Promise<void>((resolve, reject) => {
      libre.convert(
        inputBuf,
        ext,
        undefined,
        async (err: any, done: Buffer) => {
          if (err) {
            console.error("LibreOffice conversion error:", err);
            return reject(err);
          }

          try {
            await fs.writeFile(outputPath, done);
            resolve();
          } catch (writeErr) {
            reject(writeErr);
          }
        },
      );
    });
  } catch (err) {
    console.error("convertPDFToOffice failed:", err);
    throw err;
  }
};

export const convertImageToPDF = async (inputPath: string, outputPath: string) => {
  try {
    const imageBuffer = await fs.readFile(inputPath);
    const metadata = await sharp(imageBuffer).metadata();

    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({
        size: [metadata.width || 595, metadata.height || 842],
        margin: 0,
      });

      const stream = fsSync.createWriteStream(outputPath);

      doc.pipe(stream);

      doc.image(imageBuffer, 0, 0, {
        width: metadata.width,
        height: metadata.height,
      });

      doc.end();

      stream.on("finish", () => resolve());
      stream.on("error", (err) => reject(err));
    });
  } catch (err) {
    console.error("convertImageToPDF failed:", err);
    throw err;
  }
};
