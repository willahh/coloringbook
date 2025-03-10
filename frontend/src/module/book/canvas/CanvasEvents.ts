import * as fabric from 'fabric';

declare module 'fabric' {
  interface Canvas {
    objSelected?: fabric.Object | null;
    lastPosX?: number;
    lastPosY?: number;
    isDragging?: boolean;
  }
}

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
    if (!opt.e.ctrlKey && !opt.e.metaKey) {
      // Assure que ce n'est pas un événement de zoom
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
    }
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
