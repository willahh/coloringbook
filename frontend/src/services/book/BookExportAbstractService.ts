import jsPDF from 'jspdf';
import * as fabric from 'fabric';
import { Page } from '@apptypes/book';
import { ExportQuality } from '@/common/types/book.enum';
import canvasService from '../CanvasService';

interface CanvasService {
  generatePagePreview(
    page: Page,
    options: { width: number; height: number }
  ): Promise<string>;
}

export abstract class BookExportAbstractService {
  constructor(protected canvasService: CanvasService) {}

  protected async getPDF(
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
}
