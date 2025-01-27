import { IBook, Page } from '@/domain/book';

export class PageService {
  public static addPage(p_oBookData: IBook, p_oPage: Page): IBook {
    const page: Page = { ...p_oPage };
    p_oBookData.pages = [...p_oBookData.pages];
    page.pageId =
      p_oBookData.pages.reduce((max, page) => Math.max(max, page.pageId), 0) +
      1;
    page.pageNumber = p_oBookData.pages.length + 1;
    p_oBookData.pages.push(page);
    return { ...p_oBookData };
  }

  public static getPage(
    p_oBookData: IBook,
    p_nPageId: number
  ): Page | undefined {
    return p_oBookData.pages.find((page) => page.pageId === p_nPageId);
  }

  public static updatePage(
    p_oBookData: IBook,
    p_iPageId: number,
    p_oUpdatedPage: Partial<Page>
  ): IBook {
    const index = p_oBookData.pages.findIndex(
      (page) => page.pageId === p_iPageId
    );
    if (index !== -1) {
      p_oBookData.pages[index] = {
        ...p_oBookData.pages[index],
        ...p_oUpdatedPage,
      };
    }
    return { ...p_oBookData };
  }

  public static deletePage(p_oBookData: IBook, p_nPageId: number): IBook {
    const newPages = [...p_oBookData.pages].filter(
      (page) => page.pageId !== p_nPageId
    );
    p_oBookData.pages = newPages;
    p_oBookData.pageCount = p_oBookData.pages.length; // Update page count
    return { ...p_oBookData };
  }
}
