import { IBook, Page } from '@/domain/book';
import fabric from 'fabric';

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
    p_aoPages: Page[],
    p_nPageId: number
  ): Page | undefined {
    return p_aoPages.find((page) => page.pageId === p_nPageId);
  }

  public static updatePage(
    p_aoPages: Page[],
    p_iPageId: number,
    p_oUpdatedPage: Partial<Page>
  ): Page[] {
    const pages = [...p_aoPages];
    const index = pages.findIndex((page) => page.pageId === p_iPageId);
    if (index !== -1) {
      pages[index] = {
        ...p_aoPages[index],
        ...p_oUpdatedPage,
      };
    }
    return pages;
  }

  public static deletePage(p_oBookData: IBook, p_nPageId: number): IBook {
    const newPages = [...p_oBookData.pages].filter(
      (page) => page.pageId !== p_nPageId
    );
    p_oBookData.pages = newPages;
    p_oBookData.pageCount = p_oBookData.pages.length; // Update page count
    return { ...p_oBookData };
  }

  public static getImage(canvas: fabric.Canvas): string {
    const imgData = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 4, // Increase the multiplier for better quality
    });

    return imgData;
  }

  public static updateThumbImageData(
    pages: Page[],
    canvas: fabric.Canvas,
    pageId: number,
  ): Page[] {
    const image = this.getImage(canvas);
    const newPages: Page[] = this.updatePage(pages, pageId, {
      thumbImageData: image,
    });
    return newPages;
  }
}
