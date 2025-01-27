import { IBook, Page } from '@/domain/book';

export class PageService {
  public static createPage(bookData: IBook, newPage: Page): IBook {
    newPage.pageId =
      bookData.pages.reduce((max, page) => Math.max(max, page.pageId), 0) + 1;
    newPage.pageNumber = bookData.pages.length + 1;
    bookData.pages.push(newPage);
    // await this.saveBookData(bookData);
    return { ...bookData };
  }

  public static getPage(bookData: IBook, pageId: number): Page | undefined {
    return bookData.pages.find((page) => page.pageId === pageId);
  }

  public static updatePage(
    bookData: IBook,
    pageId: number,
    updatedPage: Partial<Page>
  ): IBook {
    const index = bookData.pages.findIndex((page) => page.pageId === pageId);
    if (index !== -1) {
      bookData.pages[index] = { ...bookData.pages[index], ...updatedPage };
      // await this.saveBookData(bookData);
    }
    return { ...bookData };
  }

  public static deletePage(bookData: IBook, pageId: number): IBook {
    const newPages = bookData.pages.filter((page) => page.pageId !== pageId);
    bookData.pages = newPages;
    bookData.pageCount = bookData.pages.length; // Update page count
    // await this.saveBookData(bookData);
    return { ...bookData };
  }
}
