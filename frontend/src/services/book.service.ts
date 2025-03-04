import _ from 'lodash';
import jsPDF from 'jspdf'; // ou toute autre bibliothèque que vous utilisez pour PDF
import { format } from 'date-fns'; // Importe la fonction format de date-fns
import * as fabric from 'fabric';
import { Book, Page } from '@apptypes/book';
import { BookPageParams } from '@/common/interfaces';
import { BookFormatHelper } from '@/common/utils/BookFormatHelper';
import { BookFormat, ExportQuality } from '@/common/types/book.enum';
import canvasService from './canvas.service';

/**
 * The version of the book data used in the application.
 * This constant is used to ensure compatibility between different versions of book data.
 */
const DEFAULT_BOOK_DATA_VERSION = '1.0';
const LATEST_BOOK_DATA_VERSION = '1.0';

export class BookService {
  static migrateBookJson(
    jsonData: Partial<Book>,
    fileVersion: string
  ): Partial<Book> {
    const data = { ...jsonData };

    if (fileVersion !== LATEST_BOOK_DATA_VERSION) {
      throw new Error(
        `The file version uploaded (${fileVersion}) is different from the latest book data version required: ${LATEST_BOOK_DATA_VERSION}`
      );
    }

    // if (fileVersion === '1.0' && targetVersion === '1.1') {
    //   data = {
    //     ...data,
    //     version: '1.1',
    //     // Ajoute d’autres transformations ici
    //   };
    // }

    return data;
  }

  static normalizeBookData(book: Partial<Book>): {
    book: Book;
    isModified: boolean;
  } {
    let isModified = false;
    let normalizedBook: Partial<Book> = { ...book };

    // 1. Vérifie et normalise la version
    if (!normalizedBook.version) {
      console.info(
        `book.version is not defined, set it to the current default value ${LATEST_BOOK_DATA_VERSION}`
      );
      normalizedBook.version = LATEST_BOOK_DATA_VERSION;
      // isModified = true;
    }

    // 2. Applique les migrations si la version est ancienne
    if (
      normalizedBook.version &&
      normalizedBook.version !== LATEST_BOOK_DATA_VERSION
    ) {
      normalizedBook =
        this.migrateBookJson(normalizedBook, LATEST_BOOK_DATA_VERSION) ||
        normalizedBook;
      // isModified = true;
    }

    // 3. Normalise les champs essentiels
    // normalizedBook.id = normalizedBook.id || 0;
    // normalizedBook.name = normalizedBook.name || 'Untitled Book';
    normalizedBook.format = normalizedBook.format || BookFormat.A4_PORTRAIT;
    normalizedBook.pageCount = normalizedBook.pageCount || 6;

    // 4. Gère les pages
    if (!normalizedBook.pages || normalizedBook.pages.length === 0) {
      const aspectRatio = BookFormatHelper.getAspectRatio(
        normalizedBook.format
      );
      if (!aspectRatio) {
        throw new Error(`Format invalide : ${normalizedBook.format}`);
      }
      normalizedBook.pages = Array.from(
        { length: normalizedBook.pageCount || 6 },
        (_, i): Page => ({
          pageId: i + 1,
          pageNumber: i + 1,
          aspectRatio: aspectRatio,
          elements: [],
        })
      );
      isModified = true;
    } else {
      // Normalise chaque page existante
      normalizedBook.pages = normalizedBook.pages.map((page) => ({
        pageId: page.pageId || 0,
        pageNumber: page.pageNumber || 0,
        aspectRatio:
          page.aspectRatio ||
          BookFormatHelper.getAspectRatio(
            normalizedBook.format as BookFormat
          ) ||
          1,
        elements: page.elements || [],
      }));
    }

    // 5. Normalise createdAt et updatedAt
    normalizedBook.createdAt =
      normalizedBook.createdAt || new Date().toISOString();
    normalizedBook.updatedAt =
      normalizedBook.updatedAt || normalizedBook.createdAt;

    // 6. Valide les données
    if (
      // normalizedBook.id < 0 ||
      !normalizedBook.name ||
      normalizedBook.pageCount < 0
    ) {
      throw new Error(
        'Données du livre invalides : ID, nom ou pageCount invalides'
      );
    }

    return {
      book: normalizedBook as Book, // Cast explicite pour garantir le type Book
      isModified: isModified,
    };
  }

  // static migrateBookJson(normalizedBook: Partial<Book>, LATEST_BOOK_DATA_VERSION: string): Partial<Book> {
  //   throw new Error('Method not implemented.');
  // }

  // static prepareBookData(book: Book): { book: Book; isModified: boolean } {
  //   let isModified = false;
  //   if (!book.pages || book.pages.length === 0) {
  //     const aspectRatio = BookFormatHelper.getAspectRatio(book.format);
  //     const defaultPages = Array.from(
  //       { length: book.pageCount },
  //       (_, i): Page => ({
  //         pageId: i + 1,
  //         pageNumber: i + 1,
  //         aspectRatio: aspectRatio,
  //         elements: [],
  //       })
  //     );
  //     isModified = true;
  //     book.pages = defaultPages;
  //   }
  //   if (!book.version) {
  //     console.info(
  //       `book.version is not defined, set it to the current default value BOOK_DATA_VERSION: ${LATEST_BOOK_DATA_VERSION}`
  //     );
  //     book.version = LATEST_BOOK_DATA_VERSION;
  //   }

  //   return { book: book, isModified: isModified };
  // }

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

  public exportBookToFile(book: Book) {
    const now = new Date();
    const dateTimeStr = format(now, 'yyyy-MM-dd-HHmmss');
    const fileName = `coloring-book-export-${book.id}-${dateTimeStr}.json`;
    const jsonContent = JSON.stringify(book, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  public importBookFromJson(fileContent: string/*, currentBookId: number*/): Book {
    console.log('importBookFromJson');
    try {
      const jsonData = JSON.parse(fileContent);
      const fileVersion = jsonData.version || DEFAULT_BOOK_DATA_VERSION;
      console.log('[importBookFromJson] File version detected:', fileVersion);

      // Applique les migrations si nécessaire pour atteindre la version actuelle
      const migratedData = BookService.migrateBookJson(jsonData, fileVersion);

      // Normalise les données pour gérer les champs manquants ou optionnels
      const { book: normalizedBook } =
        BookService.normalizeBookData(migratedData);

      // Valide les données normalisées
      if (!normalizedBook.id || !normalizedBook.name) {
        throw new Error(
          'Données du livre invalides : ID, nom ou pages manquants'
        );
      }
      // if (normalizedBook.id && normalizedBook.id !== currentBookId) {
      //   throw new Error(
      //     `L’id importé (${normalizedBook.id}) diffère de l’id actuel (${currentBookId}).`
      //   );
      // }

      // Retourne le livre prêt à être utilisé
      return normalizedBook;
    } catch (error) {
      console.error('Erreur lors de l’import du livre JSON:', error);
      throw new Error(
        `Impossible d’importer le livre : ${
          error instanceof Error ? error.message : 'Format JSON invalide'
        }`
      );
    }
  }
}

// FIXME: Utiliser soit des méthodes statiques, soit instancier le service quelque part
// la seconde approche est meilleur pour faire de l'injection de dépendance.
export const bookService = new BookService();
