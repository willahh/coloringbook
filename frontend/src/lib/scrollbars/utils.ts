import canvasService from '@/services/canvas.service';
import * as fabric from 'fabric';

interface CustomPointerEventInfo<EventType extends Event> {
  e: EventType;
  viewportPoint: { x: number; y: number };
}

export const makeMouseWheel =
  (canvas: fabric.Canvas, size = { min: 0.02, max: 256 }) =>
  (options: CustomPointerEventInfo<WheelEvent>) => {
    const e = options.e;
    if (
      'upperCanvasEl' in canvas &&
      e.target ===
        (canvas as { upperCanvasEl: HTMLCanvasElement }).upperCanvasEl
    ) {
      e.preventDefault();
    }

    console.log('makeMouseWheel');
    const isTouchScale = Math.floor(e.deltaY) !== Math.ceil(e.deltaY);
    const totalWidth = canvasService.getMaxPageWidth(canvas);
    const canvasWidth = canvas.getWidth();

    if (e.ctrlKey || e.metaKey) {
      // Logique de zoom avec contrainte intégrée
      const speed = isTouchScale ? 0.99 : 0.998;
      let zoom = canvas.getZoom();
      zoom *= speed ** e.deltaY;
      if (zoom > size.max) zoom = size.max;
      else if (zoom < size.min) zoom = size.min;
      const point = new fabric.Point(
        options.viewportPoint.x,
        options.viewportPoint.y
      );

      // Appliquer le zoom sans immédiatement mettre à jour le viewport
      const originalZoom = canvas.getZoom();
      const zoomRatio = zoom / originalZoom;

      canvas.zoomToPoint(point, zoom);

      if (canvas.viewportTransform) {
        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;

        // Calculer la nouvelle position X après le zoom
        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          totalWidth * zoomRatio, // Ajustement pour le zoom
          vpt[4] // Position X actuelle après le zoom
        );

        vpt[4] = newX; // Appliquer la contrainte
        canvas.setViewportTransform(vpt);
      }

      canvas.requestRenderAll();
    } else {
      if (canvas.viewportTransform) {
        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
        const x = vpt[4] - e.deltaX;
        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          totalWidth,
          x
        );

        vpt[4] = newX;
        vpt[5] -= e.deltaY; // Déplacement vertical sans changement

        canvas.setViewportTransform(vpt);
        canvas.requestRenderAll();
      }
    }
  };
