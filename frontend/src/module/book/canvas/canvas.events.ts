import * as fabric from 'fabric';
// import { Position, Scale } from './canvas.context';

declare module 'fabric' {
  interface Canvas {
    objSelected?: fabric.Object | null;
    lastPosX?: number;
    lastPosY?: number;
    isDragging?: boolean;
  }
}

export const handleMouseWheel =
  (
    canvas: fabric.Canvas,
    setViewportTransform: React.Dispatch<React.SetStateAction<fabric.TMat2D>>
  ) =>
  (opt: fabric.TEvent<WheelEvent>) => {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.988 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
    // const scaleX = canvas.viewportTransform[0];
    // const scaleY = canvas.viewportTransform[3];
    // console.log(`#10 scaleX: ${scaleX} scaleY: ${scaleY}`);
    // if (setScale) {

    setTimeout(() => {
      setViewportTransform([...canvas.viewportTransform]);
      // setPosition({ x: vpt[4], y: vpt[5] });
      // setScale({ scaleX: vpt[0], scaleY: vpt[3] });
    }, 1000);
    // } else {
    //   console.error('setScale is undefined');
    // }

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

export const handleMouseUp =
  (
    canvas: fabric.Canvas,
    setViewportTransform: React.Dispatch<React.SetStateAction<fabric.TMat2D>>
  ) =>
  () => {
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.isDragging = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';

    if (canvas.lastPosX && canvas.lastPosY) {
      setViewportTransform([...canvas.viewportTransform]);
      // if (setPosition) {
      //   console.log('#3.1 call setPosition');
      //   const vpt = canvas.viewportTransform;
      //   setPosition({ x: vpt[4], y: vpt[5] });
      // } else {
      //   console.error('setPosition is undefined');
      // }
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
