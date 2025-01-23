import jsPDF from 'jspdf'; // ou toute autre bibliothèque que vous utilisez pour PDF
import * as fabric from 'fabric';

class BookService {
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
