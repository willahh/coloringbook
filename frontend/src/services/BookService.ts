import _ from 'lodash';
import jsPDF from 'jspdf'; // ou toute autre bibliothèque que vous utilisez pour PDF
import * as fabric from 'fabric';
import { IBook, Page } from '@/domain/book';
import { getBooksUrl } from '@/utils/api';
import { BookFormatHelper } from '@/utils/BookUtils';

export class BookService {
  static async getBook(bookId: string): Promise<IBook> {
    const response = await fetch(`${getBooksUrl()}/${bookId}`);
    return await response.json();
  }
  static async updateBook(bookId: string, book: Partial<IBook>) {
    const response = await fetch(`${getBooksUrl()}/${bookId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    return await response.json();
  }

  static prepareBookData(book: IBook): { book: IBook; isModified: boolean } {
    // Si le livre n'a pas de pages, ajoutons-en 3 par défaut
    let isModified = false;
    if (!book.pages || book.pages.length === 0) {
      const aspectRatio = BookFormatHelper.getAspectRatio(book.format);
      const defaultPages = Array.from(
        { length: 3 },
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

  private getPDF(
    canvas: fabric.Canvas,
    dimensions: { width: number; height: number }
  ): jsPDF | undefined {
    if (canvas) {
      const pdf = new jsPDF('p', 'px', [dimensions.width, dimensions.height]);
      const imgData = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 4, // Increase the multiplier for better quality
      });

      return pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        dimensions.width,
        dimensions.height
      );
    }
  }

  public exportToPDF({
    canvas,
    dimensions,
  }: {
    canvas: fabric.Canvas;
    dimensions: { width: number; height: number };
  }) {
    if (canvas) {
      const pdf = this.getPDF(canvas, dimensions);
      if (pdf) {
        pdf.save('canvas.pdf');
      }
    }
  }

  public printPDF({ canvas }: { canvas: fabric.Canvas }) {
    if (canvas) {
      const pdf = this.getPDF(canvas, {
        width: canvas.width || 0,
        height: canvas.height || 0,
      });
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

export const bookService = new BookService();
