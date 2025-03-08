import _ from 'lodash';
import { format } from 'date-fns'; // Importe la fonction format de date-fns

import { Book, Page } from '@apptypes/book';
import { BookFormatHelper } from '@/common/utils/BookFormatHelper';
import { BookFormat } from '@/common/types/book.enum';
import { BookPageParams } from '@/common/interfaces';

export class BookDataService {
  private readonly LATEST_BOOK_DATA_VERSION = '1.0';
  private readonly DEFAULT_BOOK_DATA_VERSION = '1.0';

  migrateBookJson(jsonData: Partial<Book>, fileVersion: string): Partial<Book> {
    const data = { ...jsonData };

    if (fileVersion !== this.LATEST_BOOK_DATA_VERSION) {
      throw new Error(
        `Version du fichier (${fileVersion}) différente de la version requise (${this.LATEST_BOOK_DATA_VERSION})`
      );
    }

    return data;
  }

  //   static normalizeBookData(book: Partial<Book>): {
  normalizeBookData(book: Partial<Book>): {
    book: Book;
    isModified: boolean;
  } {
    let isModified = false;
    let normalizedBook: Partial<Book> = { ...book };

    // 1. Vérifie et normalise la version
    if (!normalizedBook.version) {
      console.info(
        `book.version is not defined, set it to the current default value ${this.LATEST_BOOK_DATA_VERSION}`
      );
      normalizedBook.version = this.LATEST_BOOK_DATA_VERSION;
      // isModified = true;
    }

    // 2. Applique les migrations si la version est ancienne
    if (
      normalizedBook.version &&
      normalizedBook.version !== this.LATEST_BOOK_DATA_VERSION
    ) {
      normalizedBook =
        this.migrateBookJson(normalizedBook, this.LATEST_BOOK_DATA_VERSION) ||
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

  transformPagesToSpread(pages: Page[]): Page[][] {
    if (pages.length > 0) {
      return [
        [_.head(pages)],
        ..._.chunk(_.dropRight(_.drop(pages), 1), 2),
        [_.last(pages)],
      ] as Page[][];
    }
    return [];
  }

  getFirstPageId(pages: Page[]): number {
    return pages[0].pageId;
  }

  getPageFromPageId(pages: Page[], pageId: number): Page {
    const page = pages.find((p) => p.pageId === pageId);
    if (!page) console.error(`Page non trouvée pour pageId: ${pageId}`);
    return page || pages[0]; // Retourne la première page en cas d’erreur
  }

  getSpreadForPage(pages: Page[], pageId: number): Page[] {
    if (pages.length === 0) {
      console.warn('Aucune page disponible');
      return [];
    }
    const spreadPages = this.transformPagesToSpread(pages);
    const flatPages = spreadPages.flat();
    const flatIndex = flatPages.findIndex((p) => p.pageId === pageId);
    if (flatIndex === -1) console.warn(`Page avec ID ${pageId} non trouvée`);

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

  getPageSpread(pageParams: BookPageParams, pages: Page[]) {
    const pageId = Number(pageParams.pageId) || this.getFirstPageId(pages);
    const useSpread = false;
    return useSpread
      ? this.getSpreadForPage(pages, pageId)
      : [this.getPageFromPageId(pages, pageId)];
  }

  getNextPageId(pageId: number, pages: Page[]): number | undefined {
    const currentIndex = pages.findIndex((p) => p.pageId === pageId);
    return currentIndex < pages.length - 1
      ? pages[currentIndex + 1].pageId
      : pages[currentIndex - 1]?.pageId;
  }

  exportBookToFile(book: Book) {
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

  importBookFromJson(fileContent: string): Book {
    try {
      const jsonData = JSON.parse(fileContent);
      const fileVersion = jsonData.version || this.DEFAULT_BOOK_DATA_VERSION;
      console.log('[importBookFromJson] Version détectée:', fileVersion);

      const migratedData = this.migrateBookJson(jsonData, fileVersion);
      const { book: normalizedBook } = this.normalizeBookData(migratedData);

      if (!normalizedBook.id || !normalizedBook.name) {
        throw new Error('Données invalides : ID ou nom manquant');
      }

      return normalizedBook;
    } catch (error) {
      console.error('Erreur lors de l’import :', error);
      throw new Error(
        `Import impossible : ${
          error instanceof Error ? error.message : 'JSON invalide'
        }`
      );
    }
  }
}
