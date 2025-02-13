import type { Canvas, TMat2D, TPointerEventInfo } from 'fabric';
const SIZE = {
  max: 256,
  min: 0.02,
};

export const makeMouseWheel =
  (canvas: Canvas, size = SIZE) =>
  (options: TPointerEventInfo<WheelEvent>) => {
    const e = options.e;
    if (e.target == canvas.upperCanvasEl) e.preventDefault();

    const isTouchScale = Math.floor(e.deltaY) != Math.ceil(e.deltaY);
    if (e.ctrlKey || e.metaKey) {
      const speed = isTouchScale ? 0.99 : 0.998;
      let zoom = canvas.getZoom();
      zoom *= speed ** e.deltaY;
      if (zoom > size.max) zoom = size.max;
      else if (zoom < size.min) zoom = size.min;
      canvas.zoomToPoint(options.viewportPoint, zoom);
      canvas.requestRenderAll();
      return;
    }
    const vpt = canvas.viewportTransform.slice(0) as TMat2D;
    vpt[4] -= e.deltaX;
    vpt[5] -= e.deltaY;
    canvas.setViewportTransform(vpt);
    canvas.requestRenderAll();
  };
