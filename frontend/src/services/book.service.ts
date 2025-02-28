import _ from 'lodash';
import jsPDF from 'jspdf'; // ou toute autre bibliothèque que vous utilisez pour PDF
import * as fabric from 'fabric';
import { Book, Page } from '@apptypes/book';
import { BookPageParams } from '@/common/interfaces';
import { getBooksUrl } from '@/common/utils/api';
import { BookFormatHelper } from '@/common/utils/BookFormatHelper';
import { ExportQuality } from '@/common/types/book.enum';
import canvasService from './canvas.service';
export class BookService {
  static async getBook(bookId: number): Promise<Book> {
    const response = await fetch(`${getBooksUrl()}/${bookId}`);
    return await response.json();
  }

  static async updateBook(bookId: number, book: Partial<Book>) {
    const response = await fetch(`${getBooksUrl()}/${bookId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    return await response.json();
  }

  static prepareBookData(book: Book): { book: Book; isModified: boolean } {
    let isModified = false;
    if (!book.pages || book.pages.length === 0) {
      const aspectRatio = BookFormatHelper.getAspectRatio(book.format);
      const defaultPages = Array.from(
        { length: book.pageCount },
        (_, i): Page => ({
          pageId: i + 1,
          pageNumber: i + 1,
          aspectRatio: aspectRatio,
          elements: [],
        })
      );
      isModified = true;
      book.pages = defaultPages;
    }

    return { book: book, isModified: isModified };
  }

  static transformPagesToSpread(pages: Page[]): Page[][] {
    if (pages.length > 0) {
      return [
        // First page is alone
        [_.head(pages)],

        // Middle pages, grouped by two
        ..._.chunk(_.dropRight(_.drop(pages), 1), 2),

        // Last page is alone
        [_.last(pages)],
      ] as Page[][];
    } else {
      return [];
    }
  }

  static getFirstPageId(pages: Page[]): number {
    return pages[0].pageId;
  }

  static getPageFromPageId(pages: Page[], pageId: number): Page {
    const flatIndex = pages.findIndex((page) => {
      return page?.pageId === pageId;
    });
    if (flatIndex === -1) {
      console.error(`Cannot find page index. pageId: ${pageId}`);
    }
    const page = pages[flatIndex];
    return page;
  }
  static getSpreadForPage(pages: Page[], pageId: number): Page[] {
    if (pages.length === 0) {
      console.warn('No pages available');
      return []; // Return an empty array if there are no pages
    }

    const spreadPages = this.transformPagesToSpread(pages);
    const flatPages = spreadPages.flat();

    // Find the index of the page in the flattened array
    const flatIndex = flatPages.findIndex((page) => {
      return page?.pageId === pageId;
    });

    if (flatIndex === -1) {
      console.warn(`Page with ID ${pageId} not found`);
    }

    // Determine which spread contains the page
    let currentSpreadIndex = 0;
    let pagesInCurrentSpread = 0;
    for (let i = 0; i < spreadPages.length; i++) {
      pagesInCurrentSpread += spreadPages[i].length;
      if (flatIndex < pagesInCurrentSpread) {
        currentSpreadIndex = i;
        break;
      }
    }

    return spreadPages[currentSpreadIndex];
  }

  static getPageSpread(pageParams: BookPageParams, pages: Page[]) {
    const pageId =
      Number(pageParams.pageId) || BookService.getFirstPageId(pages);
    const useSpread = false; // Display 2 or more pages per spread

    if (useSpread) {
      return BookService.getSpreadForPage(pages, pageId);
    } else {
      const page = BookService.getPageFromPageId(pages, pageId);
      if (page) {
        return [page];
      } else {
        return [];
      }
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
        pdf.save('canvas.pdf');
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

  public getNextPageId(pageId: number, pages: Page[]): number | undefined {
    const currentIndex = pages.findIndex((p) => p.pageId === pageId);
    return currentIndex < pages.length - 1
      ? pages[currentIndex + 1].pageId
      : pages[currentIndex - 1]?.pageId;
  }
}

export const bookService = new BookService();
