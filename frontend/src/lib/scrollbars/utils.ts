import canvasService from '@/services/canvas.service';
import * as fabric from 'fabric';

interface CustomPointerEventInfo<EventType extends Event> {
  e: EventType;
  viewportPoint: { x: number; y: number };
}

export const makeMouseWheelWithAnimation =
  (
    canvas: fabric.Canvas,
    size = { min: 0.02, max: 256 },
    enableZoomAnimation = true,
    setViewportTransform: React.Dispatch<
      React.SetStateAction<fabric.TMat2D | undefined>
    >,
    isMobile: boolean
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
    const totalHeight = canvasService.getTotalPageHeightCumulated(
      canvas,
      isMobile
    );
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    let animationFrameId: number | null = null;
    let momentumZoomVelocity = 0;

    function applyZoom(zoom: number, point: fabric.Point) {
      canvas.zoomToPoint(point, zoom);

      if (canvas.viewportTransform) {
        const vpt = [...canvas.viewportTransform] as fabric.TMat2D;
        const adjustedTotalWidth = totalWidth * zoom;
        const adjustedTotalHeight = totalHeight * zoom; // Ajustement pour la hauteur
        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          adjustedTotalWidth,
          vpt[4]
        );
        const newY = canvasService.constrainVerticalMovement(
          canvasHeight,
          adjustedTotalHeight,
          vpt[5]
        );

        vpt[4] = newX;
        vpt[5] = newY;
        setViewportTransform([...canvas.viewportTransform]);
        canvas.setViewportTransform(vpt);
      }
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
        const y = vpt[5] - e.deltaY;
        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          totalWidth * canvas.getZoom(),
          x
        );
        const newY = canvasService.constrainVerticalMovement(
          canvasHeight,
          totalHeight * canvas.getZoom(),
          y
        );

        console.log('#z totalHeight:', totalHeight);

        vpt[4] = newX;
        vpt[5] = newY;
        setViewportTransform([...vpt]);
        canvas.setViewportTransform(vpt);
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
  (options: CustomPointerEventInfo<WheelEvent>, isMobile: boolean) => {
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
    const maxPageHeight = canvasService.getTotalPageHeightCumulated(
      canvas,
      isMobile
    ); // Ajout de la hauteur totale
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight(); // Ajout de la hauteur du canvas

    if (e.ctrlKey || e.metaKey) {
      const speed = isTouchScale ? 0.99 : 0.998;
      let zoom = canvas.getZoom();
      zoom *= speed ** e.deltaY;
      if (zoom > size.max) zoom = size.max;
      else if (zoom < size.min) zoom = size.min;
      const point = new fabric.Point(
        options.viewportPoint.x,
        options.viewportPoint.y
      );

      const originalZoom = canvas.getZoom();
      const zoomRatio = zoom / originalZoom;
      canvas.zoomToPoint(point, zoom);

      if (canvas.viewportTransform) {
        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;

        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          maxPageWidth * zoomRatio,
          vpt[4]
        );
        const newY = canvasService.constrainVerticalMovement(
          canvasHeight,
          maxPageHeight * zoomRatio,
          vpt[5]
        ); // Contrainte verticale

        vpt[4] = newX;
        vpt[5] = newY;
        setViewportTransform([...canvas.viewportTransform]);
        canvas.setViewportTransform(vpt);
      }

      canvas.requestRenderAll();
    } else {
      if (canvas.viewportTransform) {
        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
        const x = vpt[4] - e.deltaX;
        const y = vpt[5] - e.deltaY; // Calcul de la nouvelle position Y
        const newX = canvasService.constrainHorizontalMovement(
          canvasWidth,
          maxPageWidth,
          x
        );
        const newY = canvasService.constrainVerticalMovement(
          canvasHeight,
          maxPageHeight,
          y
        ); // Contrainte verticale

        vpt[4] = newX;
        vpt[5] = newY;
        setViewportTransform([...canvas.viewportTransform]);
        canvas.setViewportTransform(vpt);
      }
    }
  };
