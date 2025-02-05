import * as fabric from 'fabric';
import { GraphicAsset } from '@/domain/graphic-asset.entity';
import { IBook, Obj, Page } from '@/domain/book';
import { ElementService } from '@/services/element.service';
import { PageService } from '@/services/page.service';
declare module 'fabric' {
  interface Canvas {
    objSelected?: fabric.Object | null;
    lastPosX?: number;
    lastPosY?: number;
    isDragging?: boolean;
  }
}

export const handleGraphicAssetItemClick = (
  asset: GraphicAsset,
  book: IBook | null,
  canvas: fabric.Canvas | null,
  pages: Page[],
  pageId: string,
  setPages: React.Dispatch<React.SetStateAction<Page[]>>,
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const element: Obj | null = ElementService.elementFromGraphicAsset(asset);
  if (!element || !book || !canvas) return;

  const updatedBook = ElementService.add(
    { ...book, pages },
    element,
    Number(pageId)
  );
  setPages(updatedBook.pages);
  setIsModified(true);
};

export const handleRectangleClick = (
  canvas: fabric.Canvas | null,
  pages: Page[],
  pageId: string,
  setPages: React.Dispatch<React.SetStateAction<Page[]>>,
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!canvas) return;

  const pagesNew = PageService.updateThumbImageData(
    pages,
    canvas,
    Number(pageId)
  );
  setPages(pagesNew);
  setIsModified(true);
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
