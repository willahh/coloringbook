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
    pageNumber?: number;
    height?: number;
    top?: number;
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
    let lastVerticalOffset = 0;

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
              canvas
                .getObjects('rect')
                .filter((r) => r.isPage)
                .map((r) => ({
                  pageId: r.get('pageId'),
                  pageNumber: r.get('pageNumber'),
                  aspectRatio: r.get('aspectRatio'),
                  elements: r.get('elements'),
                })) || [],
              pageId,
              isMobile
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
          x,
          isMobile
        );
        vpt[5] = canvasService.constrainVerticalMovement(
          canvasHeight,
          totalHeight * canvas.getZoom(),
          y,
          isMobile
        );

        setViewportTransform([...vpt]);
        canvas.setViewportTransform(vpt);
        canvas.requestRenderAll();

        lastVerticalOffset = vpt[5];
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
            vpt[4],
            isMobile
          );
          vpt[5] = canvasService.constrainVerticalMovement(
            canvasHeight,
            totalHeight * zoom,
            vpt[5],
            isMobile
          );

          setViewportTransform([...vpt]);
          canvas.setViewportTransform(vpt);
          canvas.requestRenderAll();

          lastVerticalOffset = vpt[5];
          initialPinchDistance = currentDistance;
        }
      }
    };

    const snapToNearestPage = (startVpt: fabric.TMat2D) => {
      if (!canvas) return;

      const canvasHeight = canvas.getHeight();
      const zoom = canvas.getZoom();
      const centerY = -startVpt[5] / zoom + canvasHeight / 2 / zoom;

      const pages = canvas
        .getObjects('rect')
        .filter((obj) => obj.isPage)
        .sort((a, b) => (a.top || 0) - (b.top || 0));

      if (pages.length === 0) {
        console.warn('No pages found for snapping');
        return;
      }

      let nearestPage: fabric.Object | null = null;
      let minDistance = Infinity;

      pages.forEach((page) => {
        const pageTop = (page.top || 0) / zoom;
        const pageHeight = (page.height || 0) / zoom;
        const pageCenter = pageTop + pageHeight / 2;
        const distance = Math.abs(pageCenter - centerY);
        console.log(`Page ${page.pageNumber}: Top=${pageTop}, Center=${pageCenter}, Distance=${distance}`);

        if (distance < minDistance) {
          minDistance = distance;
          nearestPage = page;
        }
      });

      if (!nearestPage) {
        console.warn('No nearest page found');
        return;
      }

      const pageTop = (nearestPage.top || 0) / zoom;
      const pageHeight = (nearestPage.height || 0) / zoom;
      const targetY = -(pageTop + pageHeight / 2 - canvasHeight / 2 / zoom) * zoom;
      console.log(`Snapping to page ${nearestPage.pageNumber}, TargetY=${targetY}`);

      const startY = startVpt[5];
      const duration = 300; // Animation duration in ms
      const startTime = performance.now();

      const animateSnap = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic function
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        const newY = startY + (targetY - startY) * easedProgress;

        const vpt = startVpt.slice(0) as fabric.TMat2D;
        vpt[5] = canvasService.constrainVerticalMovement(
          canvasHeight,
          canvasService.getTotalPageHeightCumulated(canvas, isMobile) * zoom,
          newY,
          isMobile
        );

        setViewportTransform([...vpt]);
        canvas.setViewportTransform(vpt);
        canvas.requestRenderAll();
        console.log(`Animating: Progress=${progress}, NewY=${newY}`);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateSnap);
        } else {
          canvas.__isPanning = false;
          updateObjectControls(false);
          console.log('Snap animation completed');
        }
      };

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(animateSnap);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0 && lastTouch) {
        if (canvas.getActiveObject()) {
          lastTouch = null;
          initialPinchDistance = null;
          return;
        }

        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }

        const vpt = canvas.viewportTransform?.slice(0) as fabric.TMat2D;
        if (!vpt) {
          console.warn('Viewport transform not available');
          return;
        }

        snapToNearestPage(vpt);

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