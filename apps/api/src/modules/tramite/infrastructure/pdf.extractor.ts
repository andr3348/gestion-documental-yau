import * as pdfParse from 'pdf-parse';

export class PdfExtractor {
  static async extract(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text?.trim() ?? '';
  }
}
