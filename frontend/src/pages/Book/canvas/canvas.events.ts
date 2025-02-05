import * as fabric from 'fabric';
import { GraphicAsset } from '@/domain/graphic-asset.entity';
import { Book, Element, Page } from '@/domain/book';
import { ElementService } from '@/services/element.service';
import { PageService } from '@/services/page.service';
import { BookAction } from '../book.reducer';
declare module 'fabric' {
  interface Canvas {
    objSelected?: fabric.Object | null;
    lastPosX?: number;
    lastPosY?: number;
    isDragging?: boolean;
  }
}

export const handleGraphicAssetItemClick = (
  dispatch: React.Dispatch<BookAction>,
  asset: GraphicAsset,
  book: Book | null,
  canvas: fabric.Canvas | null,
  pages: Page[],
  pageId: number
  // setPages: React.Dispatch<React.SetStateAction<Page[]>>
  // setIsModified: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const element: Element | null = ElementService.elementFromGraphicAsset(asset);
  if (!element || !book || !canvas) return;

  const updatedBook = ElementService.add(
    { ...book, pages: book.pages },
    element,
    pageId
  );
  dispatch({ type: 'SET_BOOK', payload: updatedBook }); // Assuming SET_BOOK updates the entire book
  dispatch({ type: 'SET_MODIFIED', payload: true });

  // const updatedBook = ElementService.add({ ...book, pages }, element, pageId);
  // setPages(updatedBook.pages);
  // setIsModified(true);
};

export const handleRectangleClick = (
  dispatch: React.Dispatch<BookAction>,
  canvas: fabric.Canvas | null,
  pages: Page[],
  pageId: number
  // setPages: React.Dispatch<React.SetStateAction<Page[]>>
  // setIsModified: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log('#4 handleRectangleClick');
  if (!canvas) {
    console.error('!canvas');
    return;
  }

  // const pagesNew = PageService.updateThumbImageData(
  //   pages,
  //   canvas,
  //   Number(pageId)
  // );
  // setPages(pagesNew);
  // setIsModified(true);
  const pagesNew = PageService.updateThumbImageData(pages, canvas, pageId);
  console.log('#4 pagesNew:', pagesNew);
  console.log('#4 call dispatch SET_PAGES');
  dispatch({ type: 'SET_PAGES', payload: pagesNew });
  dispatch({ type: 'SET_MODIFIED', payload: true });
};

export const handleMouseWheel =
  (canvas: fabric.Canvas) => (opt: fabric.TEvent<WheelEvent>) => {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.988 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };

export const handleMouseOver =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    if (opt.target) {
      canvas.objSelected = opt.target;
    }
  };

export const handleMouseOut =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    if (opt.target) {
      canvas.objSelected = null;
    }
  };

export const handleMouseDown =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    const evt = opt.e;
    if (evt.altKey === true) {
      canvas.isDragging = true;
      canvas.selection = false;
      if (evt instanceof MouseEvent) {
        canvas.lastPosX = evt.clientX;
        canvas.lastPosY = evt.clientY;
      } else if (evt instanceof TouchEvent) {
        canvas.lastPosX = evt.touches[0].clientX;
        canvas.lastPosY = evt.touches[0].clientY;
      }
    }
  };

export const handleMouseMove =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    if (canvas.isDragging) {
      const e = opt.e;
      const vpt = canvas.viewportTransform;
      if (e instanceof MouseEvent) {
        vpt[4] += e.clientX - (canvas.lastPosX ?? 0);
        vpt[5] += e.clientY - (canvas.lastPosY ?? 0);
        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
      } else if (e instanceof TouchEvent) {
        vpt[4] += e.touches[0].clientX - (canvas.lastPosX ?? 0);
        vpt[5] += e.touches[0].clientY - (canvas.lastPosY ?? 0);
        canvas.lastPosX = e.touches[0].clientX;
        canvas.lastPosY = e.touches[0].clientY;
      }
      canvas.requestRenderAll();
      if (e instanceof MouseEvent) {
        canvas.lastPosX = e.clientX;
      } else if (e instanceof TouchEvent) {
        canvas.lastPosX = e.touches[0].clientX;
      }
      if (e instanceof MouseEvent) {
        canvas.lastPosY = e.clientY;
      } else if (e instanceof TouchEvent) {
        canvas.lastPosY = e.touches[0].clientY;
      }
    }
  };

export const handleMouseUp = (canvas: fabric.Canvas) => () => {
  canvas.setViewportTransform(canvas.viewportTransform);
  canvas.isDragging = false;
  canvas.selection = true;
  canvas.defaultCursor = 'default';
};

export const handleDocumentKeyDown =
  (canvas: fabric.Canvas) => (evt: { altKey: boolean; code: string }) => {
    if (canvas.objSelected) {
      if (evt.altKey === true || evt.code === 'Space') {
        canvas.setCursor('grab');
        canvas.defaultCursor = 'grab';
      }
    }
  };

export const handleDocumentKeyUp = (canvas: fabric.Canvas) => () => {
  if (canvas.objSelected) {
    canvas.setCursor('default');
    canvas.defaultCursor = 'default';
  }
};
