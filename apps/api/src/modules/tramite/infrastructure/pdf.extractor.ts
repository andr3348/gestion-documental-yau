import { PDFParse } from 'pdf-parse';

export class PdfExtractor {
  static async extract(buffer: Buffer): Promise<string> {
    const pdf = new PDFParse({ data: buffer });
    const result = await pdf.getText();
    await pdf.destroy();
    return result.text?.trim() ?? '';
  }
}
