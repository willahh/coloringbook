import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as fabric from 'fabric';
import { Page } from '@apptypes/book';
import { BookExportAbstractService } from './BookExportAbstractService';
import { BookExport } from './BookExportInterface';

export class BookExportIOSService
  extends BookExportAbstractService
  implements BookExport
{
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private async checkDirectoryExists(directory: Directory): Promise<boolean> {
    try {
      const result = await Filesystem.readdir({ path: '', directory });
      return result.files.some((file) => file.name === 'Documents');
    } catch (error) {
      console.error('Erreur vérification dossier :', error);
      return false;
    }
  }

  async exportToPDF({
    canvas,
    pages,
  }: {
    canvas: fabric.Canvas;
    pages: Page[];
  }) {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Cette méthode est réservée à iOS');
    }

    const pdf = await this.getPDF(canvas, pages);
    if (!pdf) return;

    try {
      const pdfOutput = pdf.output('arraybuffer');
      const base64Data = this.arrayBufferToBase64(pdfOutput);

      const fileName = 'canvas.pdf';
      const directoryExists = await this.checkDirectoryExists(
        Directory.Documents
      );

      if (!directoryExists) {
        await Filesystem.mkdir({
          path: 'Documents',
          directory: Directory.Documents,
          recursive: true,
        });
      }

      const writeResult = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });
      await Share.share({
        title: 'Ton PDF',
        url: writeResult.uri,
        dialogTitle: 'Partager le PDF',
      });
    } catch (error) {
      console.error('Erreur export PDF iOS :', error);
      throw error;
    }
  }

  async printPDF({ canvas, pages }: { canvas: fabric.Canvas; pages: Page[] }) {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Cette méthode est réservée à iOS');
    }

    const pdf = await this.getPDF(canvas, pages);
    if (pdf) {
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.print();
      }
    }
  }
}
