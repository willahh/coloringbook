import _ from 'lodash';
import jsPDF from 'jspdf'; // ou toute autre bibliothèque que vous utilisez pour PDF
import * as fabric from 'fabric';
import { Page } from '@/domain/book';

export class BookService {
  static transformPagesToSpread(pages: Page[]): Page[][] {
    return [
      // First page is alone
      [_.head(pages)],

      // Middle pages, grouped by two
      ..._.chunk(_.dropRight(_.drop(pages), 1), 2),

      // Last page is alone
      [_.last(pages)],
    ] as Page[][];
  }

  static getSpreadForPage(pages: Page[], pageId: number): Page[] {
    const spreadPages = this.transformPagesToSpread(pages);
    const flatPages = spreadPages.flat();

    console.log('# getSpreadForPage pageId', pageId)
    console.log('# flatPages', flatPages);

    // Find the index of the page in the flattened array
    const flatIndex = flatPages.findIndex((page) => {
      console.log('# flatIndx', page);
      return page?.pageId === pageId;
    });

    if (flatIndex === -1) {
      throw new Error(`Page with ID ${pageId} not found`);
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
