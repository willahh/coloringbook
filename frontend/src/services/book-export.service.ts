import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

import jsPDF from 'jspdf';
import * as fabric from 'fabric';

import { Page } from '@apptypes/book';
import { ExportQuality } from '@/common/types/book.enum';
import canvasService from './canvas.service';


export class BookExportService {
    // FIXME: Inject CanvasService inside the constructor

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

  private async getPDF(
    canvas: fabric.Canvas,
    pages: Page[],
    quality: ExportQuality = ExportQuality.MEDIUM
  ): Promise<jsPDF | undefined> {
    if (!canvas || !pages || pages.length === 0) {
      return undefined;
    }

    let pdf: jsPDF | undefined;

    // Taille maximale en mm (basée sur la plus grande dimension d'A4)
    const MAX_DIMENSION_MM = 297; // Hauteur d'A4 portrait ou largeur d'A4 paysage
    const DPI = quality; // Utiliser la qualité passée en paramètre

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (page) {
        const widthRatio = page.aspectRatio.width;
        const heightRatio = page.aspectRatio.height;
        const aspectRatio = widthRatio / heightRatio;

        // Déterminer les dimensions en mm
        let pageWidthMm: number;
        let pageHeightMm: number;

        if (aspectRatio >= 1) {
          // Page plus large que haute (ex. paysage ou carré)
          pageWidthMm = MAX_DIMENSION_MM;
          pageHeightMm = MAX_DIMENSION_MM / aspectRatio;
        } else {
          // Page plus haute que large (ex. portrait)
          pageHeightMm = MAX_DIMENSION_MM;
          pageWidthMm = MAX_DIMENSION_MM * aspectRatio;
        }

        // Déterminer l'orientation
        const orientation = aspectRatio >= 1 ? 'l' : 'p';

        // Initialiser le PDF ou ajouter une page
        if (i === 0) {
          pdf = new jsPDF(orientation, 'mm', [pageWidthMm, pageHeightMm]);
        } else {
          pdf?.addPage([pageWidthMm, pageHeightMm], orientation);
        }

        try {
          // Calculer les dimensions en pixels pour la prévisualisation
          const previewWidthPx = pageWidthMm * (DPI / 25.4);
          const previewHeightPx = pageHeightMm * (DPI / 25.4);

          // Générer la prévisualisation
          const dataUrl = await canvasService.generatePagePreview(page, {
            width: previewWidthPx,
            height: previewHeightPx,
          });

          // Ajouter l'image au PDF
          pdf?.addImage(dataUrl, 'PNG', 0, 0, pageWidthMm, pageHeightMm);
        } catch (error) {
          console.error(
            `Erreur lors de la génération de la page ${page.pageId}:`,
            error
          );
        }
      }
    }

    // Retourner le PDF complet
    return pdf;
  }

  //   public async exportToPDF({
  public async exportToPDF({
    canvas,
    pages,
  }: {
    canvas: fabric.Canvas;
    pages: Page[];
  }) {
    if (canvas) {
      const pdf = await this.getPDF(canvas, pages);
      if (pdf) {
        if (Capacitor.isNativePlatform()) {
          try {
            const pdfOutput = pdf.output('arraybuffer'); // Obtenir l’ArrayBuffer
            console.log('Taille du PDF (bytes) :', pdfOutput.byteLength);

            // Convertir l’ArrayBuffer en base64
            const base64Data = this.arrayBufferToBase64(pdfOutput);
            console.log('Base64 généré (début) :', base64Data.substring(0, 50));

            const fileName = 'canvas.pdf';
            const filePath = fileName;

            console.log('filePath', filePath);
            const directoryExists = await this.checkDirectoryExists(
              Directory.Documents
            );
            console.log('directoryExists', directoryExists);

            if (!directoryExists) {
              await Filesystem.mkdir({
                path: 'Documents',
                directory: Directory.Documents,
                recursive: true,
              });
            }

            console.log(
              'Tentative d’écriture dans',
              Directory.Documents,
              'avec chemin',
              filePath
            );
            const writeResult = await Filesystem.writeFile({
              path: filePath,
              data: base64Data, // Utiliser la chaîne base64
              directory: Directory.Documents,
              // encoding: Encoding.UTF8, // Encoding.UTF8 est correct pour base64
            });
            console.log('PDF enregistré avec succès à :', writeResult.uri);

            // Partager le fichier
            await Share.share({
              title: 'Ton PDF',
              url: writeResult.uri,
              dialogTitle: 'Partager le PDF',
            });
            console.log('PDF partagé avec succès');
          } catch (error) {
            console.error('Erreur :', JSON.stringify(error, null, 2));
          }
        } else {
          pdf.save('canvas.pdf'); // Pour desktop
        }
      }
    }
  }

  public async printPDF({
    canvas,
    pages,
  }: {
    canvas: fabric.Canvas;
    pages: Page[];
  }) {
    if (canvas) {
      const pdf = await this.getPDF(canvas, pages);
      if (pdf) {
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(url);
        if (printWindow) {
          printWindow.addEventListener('load', () => {
            printWindow.print();
          });
        }
      }
    }
  }
}
