import * as fabric from 'fabric';

import { Page } from '@apptypes/book';
import { BookExportAbstractService } from './BookExportAbstractService';
import { BookExport } from './BookExportInterface';

export class BookExportDesktopService
  extends BookExportAbstractService
  implements BookExport
{
  async exportToPDF({
    canvas,
    pages,
  }: {
    canvas: fabric.Canvas;
    pages: Page[];
  }) {
    const pdf = await this.getPDF(canvas, pages);
    if (pdf) {
      pdf.save('canvas.pdf');
    }
  }

  async printPDF({ canvas, pages }: { canvas: fabric.Canvas; pages: Page[] }) {
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
