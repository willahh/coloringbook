import canvasService from '@/services/canvas.service';
import * as fabric from 'fabric';

interface CustomPointerEventInfo<EventType extends Event> {
  e: EventType;
  viewportPoint: { x: number; y: number };
}

/**
 * makeMouseWheelWithAnimation, fonctionne mais il y a du flickering.
 */
export const makeMouseWheelWithAnimation =
  (
    canvas: fabric.Canvas,
    size = { min: 0.02, max: 256 },
    enableZoomAnimation = true,
    setViewportTransform: React.Dispatch<
      React.SetStateAction<fabric.TMat2D | undefined>
    >
  ) =>
  (options: CustomPointerEventInfo<WheelEvent>) => {
    const e = options.e;
    if (
      'upperCanvasEl' in canvas &&
      e.target ===
        (canvas as { upperCanvasEl: HTMLCanvasElement }).upperCanvasEl
    ) {
      e.preventDefault();
    }

    const isTouchScale = Math.floor(e.deltaY) !== Math.ceil(e.deltaY);
    const totalWidth = canvasService.getMaxPageWidth(canvas);
    const canvasWidth = canvas.getWidth();

    let animationFrameId: number | null = null;
    let momentumZoomVelocity = 0;

    function applyZoom(zoom: number, point: fabric.Point) {
      canvas.zoomToPoint(point, zoom);
      // setViewportTransform([...canvas.viewportTransform]);

      if (canvas.viewportTransform) {
        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
        const adjustedTotalWidth = totalWidth * zoom;
        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          adjustedTotalWidth,
          vpt[4]
        );
        vpt[4] = newX;
        // canvas.setViewportTransform(vpt);
        setViewportTransform([...canvas.viewportTransform]);
      }

      // canvas.requestRenderAll();
    }

    function animateMomentumZoom(point: fabric.Point) {
      if (Math.abs(momentumZoomVelocity) < 0.0001) {
        animationFrameId = null;
        return;
      }
      let zoom = canvas.getZoom() * (1 + momentumZoomVelocity);
      zoom = Math.max(size.min, Math.min(size.max, zoom));
      applyZoom(zoom, point);
      momentumZoomVelocity *= 0.93;
      animationFrameId = requestAnimationFrame(() =>
        animateMomentumZoom(point)
      );
    }

    if (e.ctrlKey || e.metaKey) {
      const speed = isTouchScale ? 0.95 : 0.995;
      let zoom = canvas.getZoom();
      zoom *= speed ** e.deltaY;
      zoom = Math.max(size.min, Math.min(size.max, zoom));
      const point = new fabric.Point(
        options.viewportPoint.x,
        options.viewportPoint.y
      );

      if (enableZoomAnimation && Math.abs(e.deltaY) > 1.5) {
        momentumZoomVelocity = (speed ** e.deltaY - 1) * 0.03;
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() =>
          animateMomentumZoom(point)
        );
      } else {
        applyZoom(zoom, point);
      }
    } else {
      if (canvas.viewportTransform) {
        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
        const x = vpt[4] - e.deltaX;
        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          totalWidth * canvas.getZoom(),
          x
        );

        // if (Math.abs(e.deltaY) === 1) {
        //   canvas.set('scrolling', false);
        // } else {
        //   canvas.set('scrolling', true);
        // }
       
        vpt[4] = newX;
        vpt[5] -= e.deltaY;

        setViewportTransform([...vpt]);
        // canvas.setViewportTransform(vpt);
        // canvas.requestRenderAll();
      }
    }
  };

export const makeMouseWheel =
  (
    canvas: fabric.Canvas,
    size = { min: 0.02, max: 256 },
    setViewportTransform: React.Dispatch<
      React.SetStateAction<fabric.TMat2D | undefined>
    >
  ) =>
  (options: CustomPointerEventInfo<WheelEvent>) => {
    const e = options.e;
    if (
      'upperCanvasEl' in canvas &&
      e.target ===
        (canvas as { upperCanvasEl: HTMLCanvasElement }).upperCanvasEl
    ) {
      e.preventDefault();
    }

    const isTouchScale = Math.floor(e.deltaY) !== Math.ceil(e.deltaY);
    const maxPageWidth = canvasService.getMaxPageWidth(canvas);
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
          maxPageWidth * zoomRatio, // Ajustement pour le zoom
          vpt[4] // Position X actuelle après le zoom
        );

        vpt[4] = newX; // Appliquer la contrainte
        // canvas.setViewportTransform(vpt);
        setViewportTransform([...canvas.viewportTransform]);
      }

      canvas.requestRenderAll();
    } else {
      if (canvas.viewportTransform) {
        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
        const x = vpt[4] - e.deltaX;
        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          maxPageWidth,
          x
        );

        vpt[4] = newX;
        vpt[5] -= e.deltaY; // Déplacement vertical sans changement

        // canvas.setViewportTransform(vpt);
        // canvas.requestRenderAll();
        setViewportTransform([...canvas.viewportTransform]);
      }
    }
  };
