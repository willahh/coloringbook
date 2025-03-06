import { useEffect } from 'react';
import * as fabric from 'fabric';
import canvasService from '@/services/canvas.service';
import { Scrollbars } from '@/lib/scrollbars';

interface UseTouchControlsProps {
  canvas: fabric.Canvas | null;
  scrollbar: Scrollbars | null;
  setViewportTransform: React.Dispatch<
    React.SetStateAction<fabric.TMat2D | undefined>
  >;
}

export function useTouchControls({
  canvas,
  scrollbar,
  setViewportTransform,
}: UseTouchControlsProps) {
  useEffect(() => {
    if (!canvas || !scrollbar) return;

    let lastTouch: { x: number; y: number } | null = null;
    let initialDistance: number | null = null; // Pour pinch-to-zoom optionnel

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 2) return; // Ignore plus de 2 doigts
      if (e.touches.length === 2) {
        const [touch1, touch2] = e.touches;
        initialDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
      } else if (e.touches.length === 1) {
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvas.viewportTransform) return;

      if (e.touches.length === 2 && initialDistance) {
        e.preventDefault();
        const [touch1, touch2] = e.touches;
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        const zoomFactor = currentDistance / initialDistance;
        let zoom = canvas.getZoom() * zoomFactor;
        zoom = Math.max(0.02, Math.min(256, zoom)); // Limites comme dans makeMouseWheel
        const center = new fabric.Point(
          (touch1.clientX + touch2.clientX) / 2,
          (touch1.clientY + touch2.clientY) / 2
        );
        canvas.zoomToPoint(center, zoom);

        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
        const totalWidth = canvasService.getMaxPageWidth(canvas);
        const totalHeight = canvasService.getTotalPageHeightCumulated(canvas);
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        vpt[4] = canvasService.constrainHorizontalMovement(
          canvasWidth,
          totalWidth * zoom,
          vpt[4]
        );
        vpt[5] = canvasService.constrainVerticalMovement(
          canvasHeight,
          totalHeight * zoom,
          vpt[5]
        );

        setViewportTransform([...vpt]);
        canvas.setViewportTransform(vpt);
        canvas.requestRenderAll();

        initialDistance = currentDistance;
      } else if (e.touches.length === 1 && lastTouch && !scrollbar['_bar']) {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastTouch.x;
        const deltaY = touch.clientY - lastTouch.y;

        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
        const totalWidth = canvasService.getMaxPageWidth(canvas);
        const totalHeight = canvasService.getTotalPageHeightCumulated(canvas);
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        const x = vpt[4] + deltaX;
        const y = vpt[5] + deltaY;

        vpt[4] = canvasService.constrainHorizontalMovement(
          canvasWidth,
          totalWidth * canvas.getZoom(),
          x
        );
        vpt[5] = canvasService.constrainVerticalMovement(
          canvasHeight,
          totalHeight * canvas.getZoom(),
          y
        );

        setViewportTransform([...vpt]);
        canvas.setViewportTransform(vpt);
        canvas.requestRenderAll();

        lastTouch = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) initialDistance = null;
      if (e.touches.length === 0) lastTouch = null;
    };

    const upperCanvas = canvas.upperCanvasEl;
    upperCanvas.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    upperCanvas.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    upperCanvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      upperCanvas.removeEventListener('touchstart', handleTouchStart);
      upperCanvas.removeEventListener('touchmove', handleTouchMove);
      upperCanvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvas, scrollbar, setViewportTransform]);
}
