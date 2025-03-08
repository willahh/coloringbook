import { useEffect } from 'react';
import * as fabric from 'fabric';
import canvasService from '@/services/CanvasService';
import { Scrollbars } from '@/lib/scrollbars';
import useIsMobile from '@/common/hooks/useIsMobile';

interface UseTouchControlsProps {
  canvas: fabric.Canvas | null;
  scrollbar: Scrollbars | null;
  setViewportTransform: React.Dispatch<
    React.SetStateAction<fabric.TMat2D | undefined>
  >;
}

declare module 'fabric' {
  interface Canvas {
    __isPanning?: boolean;
    lastTapTime?: number;
    lastTapTarget?: fabric.Object | null;
  }

  interface Object {
    isPage?: boolean;
  }
}

export function useTouchControls({
  canvas,
  scrollbar,
  setViewportTransform,
}: UseTouchControlsProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvas || !scrollbar) return;

    let lastTouch: { x: number; y: number; timestamp: number } | null = null;
    let velocityX = 0;
    let velocityY = 0;
    let animationFrameId: number | null = null;
    let initialPinchDistance: number | null = null;

    const updateObjectControls = (isPanning: boolean) => {
      canvas.getObjects().forEach((obj) => {
        if (obj.type !== 'rect' || !obj.isPage) {
          obj.set({
            hasControls: !isPanning,
            hasBorders: !isPanning,
            selectable: !isPanning,
            evented: !isPanning,
          });
        }
      });
      canvas.renderAll();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 2) return;

      const touch = e.touches[0];
      lastTouch = { x: touch.clientX, y: touch.clientY, timestamp: Date.now() };
      canvas.__isPanning = false;
      updateObjectControls(false);

      const target = canvas.findTarget(e);
      if (e.touches.length === 1) {
        // // Sélection d'objet si target est selectable
        // if (target && target.selectable && !canvas.getActiveObject()) {
        //   canvas.setActiveObject(target);
        //   canvas.renderAll();
        //   return; // Arrête ici pour ne pas déclencher le pan
        // }

        // Double tap sur pageRect
        const currentTime = Date.now();
        const doubleTapThreshold = 300;
        if (
          canvas.lastTapTime &&
          currentTime - canvas.lastTapTime < doubleTapThreshold &&
          canvas.lastTapTarget === target &&
          target?.isPage
        ) {
          const pageId = target.get('pageId');
          if (pageId !== undefined) {
            canvasService.pageFocus(
              canvas,
              canvasService.canvas
                ?.getObjects('rect')
                .filter((r) => r.isPage)
                .map((r) => ({
                  pageId: r.get('pageId'),
                  pageNumber: r.get('pageNumber'),
                  aspectRatio: r.get('aspectRatio'),
                  elements: r.get('elements'),
                })) || [],
              pageId
            );
          }
          canvas.lastTapTime = 0;
        } else {
          canvas.lastTapTime = currentTime;
          canvas.lastTapTarget = target || null;
        }
      }

      if (e.touches.length === 2) {
        const [touch1, touch2] = e.touches;
        initialPinchDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
      } else {
        initialPinchDistance = null;
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvas.viewportTransform || scrollbar['_bar']) return;

      e.preventDefault();

      if (e.touches.length === 1 && !canvas.getActiveObject()) {
        const touch = e.touches[0];
        const now = Date.now();
        const deltaTime = lastTouch ? (now - lastTouch.timestamp) / 1000 : 0;
        const deltaX = touch.clientX - (lastTouch?.x || touch.clientX);
        const deltaY = touch.clientY - (lastTouch?.y || touch.clientY);

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          canvas.__isPanning = true;
          updateObjectControls(true);
        }

        if (deltaTime > 0) {
          velocityX = deltaX / deltaTime;
          velocityY = deltaY / deltaTime;
        }

        const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
        const totalWidth = canvasService.getMaxPageWidth(canvas);
        const totalHeight = canvasService.getTotalPageHeightCumulated(
          canvas,
          isMobile
        );
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

        lastTouch = { x: touch.clientX, y: touch.clientY, timestamp: now };
      } else if (e.touches.length === 2 && !canvas.getActiveObject()) {
        const [touch1, touch2] = e.touches;
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );

        if (initialPinchDistance) {
          const zoomFactor = currentDistance / initialPinchDistance;
          let zoom = canvas.getZoom() * zoomFactor;
          zoom = Math.max(0.02, Math.min(256, zoom));

          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;
          const point = new fabric.Point(centerX, centerY);

          canvas.zoomToPoint(point, zoom);

          const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
          const totalWidth = canvasService.getMaxPageWidth(canvas);
          const totalHeight = canvasService.getTotalPageHeightCumulated(
            canvas,
            isMobile
          );
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

          initialPinchDistance = currentDistance;
        }
      }
    };

    const applyMomentum = () => {
      if (
        !canvas.viewportTransform ||
        (Math.abs(velocityX) < 1 && Math.abs(velocityY) < 1)
      ) {
        animationFrameId = null;
        canvas.__isPanning = false;
        updateObjectControls(false);
        return;
      }

      const vpt = canvas.viewportTransform.slice(0) as fabric.TMat2D;
      const totalWidth = canvasService.getMaxPageWidth(canvas);
      const totalHeight = canvasService.getTotalPageHeightCumulated(
        canvas,
        isMobile
      );
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      const x = vpt[4] + velocityX * 0.016;
      const y = vpt[5] + velocityY * 0.016;

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

      velocityX *= 0.95;
      velocityY *= 0.95;

      animationFrameId = requestAnimationFrame(applyMomentum);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0 && lastTouch) {
        if (canvas.getActiveObject()) {
          lastTouch = null;
          initialPinchDistance = null;
          return;
        }

        if (Math.abs(velocityX) > 50 || Math.abs(velocityY) > 50) {
          animationFrameId = requestAnimationFrame(applyMomentum);
        } else {
          canvas.__isPanning = false;
          updateObjectControls(false);
        }

        lastTouch = null;
        initialPinchDistance = null;
      }
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
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      upperCanvas.removeEventListener('touchstart', handleTouchStart);
      upperCanvas.removeEventListener('touchmove', handleTouchMove);
      upperCanvas.removeEventListener('touchend', handleTouchEnd);
      delete canvas.__isPanning;
      delete canvas.lastTapTime;
      delete canvas.lastTapTarget;
      updateObjectControls(false);
    };
  }, [canvas, scrollbar, setViewportTransform, isMobile]);
}
