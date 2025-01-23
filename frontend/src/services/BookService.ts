import jsPDF from 'jspdf'; // ou toute autre bibliothèque que vous utilisez pour PDF
import * as fabric from 'fabric';

class BookService {
  public exportToPDF({
    canvas,
    dimensions,
  }: {
    canvas: fabric.Canvas;
    dimensions: { width: number; height: number };
  }) {
    // const canvas = canvas.current;
    if (canvas) {
      const pdf = new jsPDF('p', 'px', [dimensions.width, dimensions.height]);

      const imgData = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });

      // Les dimensions du PDF doivent correspondre à celles du canvas
      pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height);
      pdf.save('canvas.pdf');
    }
  }

  public printPDF({ canvas }: { canvas: fabric.Canvas }) {
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(
        `<img src='${dataUrl}' onload='window.print();window.close()' />`
      );
    }
  }
}

export const bookService = new BookService();
