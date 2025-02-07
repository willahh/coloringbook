import { Book, Page } from '@/types/book';
import { BookFormat } from '@/types/book.enum';
import { BookFormatHelper } from '@/utils/book.utils';
import fabric from 'fabric';

function getNewPageId(pages: Page[]) {
  const maxId = Math.max(...pages.map((page) => page.pageId));
  return maxId + 1;
}

function getNewPageNumber(pages: Page[]) {
  const maxPageNumber = Math.max(...pages.map((page) => page.pageNumber));
  return maxPageNumber + 1;
}

export class PageService {
  public static getNewPage(pages: Page[]) {
    const page: Page = {
      pageId: getNewPageId(pages),
      pageNumber: getNewPageNumber(pages),
      aspectRatio: BookFormatHelper.getAspectRatio(BookFormat.A4_PAYSAGE),
      elements: [],
    };

    return page;
  }
  public static addPage(p_oBookData: Book, p_oPage: Page): Book {
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

  public static deletePage(p_oBookData: Book, p_nPageId: number): Book {
    const newPages = [...p_oBookData.pages].filter(
      (page) => page.pageId !== p_nPageId
    );
    p_oBookData.pages = newPages;
    p_oBookData.pageCount = p_oBookData.pages.length; // Update page count
    return { ...p_oBookData };
  }

  public static getImageData(canvas: fabric.Canvas): string {
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
    pageId: number
  ): Page[] {
    const image = this.getImageData(canvas);
    const newPages: Page[] = this.updatePage(pages, pageId, {
      thumbImageData: image,
    });
    return newPages;
  }
}
