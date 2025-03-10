import { useEffect } from 'react';
import * as fabric from 'fabric';
import canvasService from '@/services/CanvasService';
import { Scrollbars } from '@/lib/scrollbars';
import useIsMobile from '@/common/hooks/useIsMobile';
import { useSelector } from '@/common/store';
import { selectBookPages } from '../../BookSlice';

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
  const pages = useSelector(selectBookPages);

  useEffect(() => {
    if (!canvas || !scrollbar) return;

    let lastTouch: { x: number; y: number; timestamp: number } | null = null;
    let startTouch: { x: number; y: number; timestamp: number } | null = null;
    let velocityY = 0;
    let animationFrameId: number | null = null;
    let initialPinchDistance: number | null = null;

    const updateObjectControls = (isPanning: boolean) => {
      const activeObject = canvas.getActiveObject();
      canvas.getObjects().forEach((obj) => {
        if (obj.type !== 'rect' || !obj.isPage) {
          if (obj === activeObject) {
            obj.set({
              hasControls: true,
              hasBorders: true,
              selectable: true,
              evented: true,
            });
          } else {
            obj.set({
              hasControls: !isPanning,
              hasBorders: !isPanning,
              selectable: !isPanning,
              evented: true,
            });
          }
        }
      });
      canvas.renderAll();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 2) return;

      const touch = e.touches[0];
      lastTouch = { x: touch.clientX, y: touch.clientY, timestamp: Date.now() };
      startTouch = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };
      canvas.__isPanning = false;
      updateObjectControls(false);

      canvas.discardActiveObject();
      canvas.renderAll();

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
            canvasService.pageFocus(canvas, pages, pageId, isMobile);
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

      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        return;
      }

      if (e.touches.length === 1) {
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

        lastTouch = { x: touch.clientX, y: touch.clientY, timestamp: now };
      } else if (e.touches.length === 2) {
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
        console.log(
          `Page ${page.pageNumber}: Top=${pageTop}, Center=${pageCenter}, Distance=${distance}`
        );

        console.log('\n#1.1 pageCenter:', pageCenter)
        console.log('#1.1 distance:', distance)
        console.log('#1.1 minDistance:', minDistance)

        if (distance < minDistance) {
          minDistance = distance;
          nearestPage = page;
        }
      });

      if (!nearestPage) {
        console.warn('No nearest page found');
        return;
      }

      const pageId = nearestPage.get('pageId');
      
      if (pageId !== undefined) {
        const targetVpt = canvasService.getPageFocusCoordinates(
          canvas,
          pageId,
          isMobile
        );
        if (targetVpt) {
          canvasService.animateViewportTransform(
            canvas,
            startVpt,
            targetVpt,
            300
          );
          canvas.__isPanning = false;
          updateObjectControls(false);
        }
      }
    };

    const snapToAdjacentPage = (
      startVpt: fabric.TMat2D,
      direction: 'up' | 'down'
    ) => {
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

      let currentPage: fabric.Object | null = null;
      let minDistance = Infinity;

      pages.forEach((page) => {
        const pageTop = (page.top || 0) / zoom;
        const pageHeight = (page.height || 0) / zoom;
        const pageCenter = pageTop + pageHeight / 2;
        const distance = Math.abs(pageCenter - centerY);

        if (distance < minDistance) {
          minDistance = distance;
          currentPage = page;
        }
      });

      if (!currentPage) {
        console.warn('No current page found');
        return;
      }

      const currentIndex = pages.indexOf(currentPage);
      let targetPage: fabric.Object | null = null;

      if (direction === 'up' && currentIndex > 0) {
        targetPage = pages[currentIndex - 1]; // Previous page
      } else if (direction === 'down' && currentIndex < pages.length - 1) {
        targetPage = pages[currentIndex + 1]; // Next page
      }

      if (targetPage) {
        console.log(
          `Flick detected, snapping to ${
            direction === 'up' ? 'previous' : 'next'
          } page`
        );
        const pageId = targetPage.get('pageId');
        if (pageId !== undefined) {
          const targetVpt = canvasService.getPageFocusCoordinates(
            canvas,
            pageId,
            isMobile
          );
          if (targetVpt) {
            canvasService.animateViewportTransform(
              canvas,
              startVpt,
              targetVpt,
              300
            );
            canvas.__isPanning = false;
            updateObjectControls(false);
          }
        }
      } else {
        console.log('No adjacent page to snap to');
        snapToNearestPage(startVpt);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0 && lastTouch && startTouch) {
        const activeObject = canvas.getActiveObject();
        const target = canvas.findTarget(e);

        if (activeObject && target === activeObject) {
          return;
        }

        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }

        const vpt = canvas.viewportTransform?.slice(0) as fabric.TMat2D;
        if (!vpt) {
          console.warn('Viewport transform not available');
          lastTouch = null;
          startTouch = null;
          initialPinchDistance = null;
          return;
        }

        const touchDuration = Date.now() - startTouch.timestamp;
        const distanceMoved = Math.hypot(
          lastTouch.x - startTouch.x,
          lastTouch.y - startTouch.y
        );

        const tapThreshold = 10;
        const tapDurationThreshold = 300;

        const isTap =
          distanceMoved < tapThreshold && touchDuration < tapDurationThreshold;

        if (isTap) {
          console.log('Tap detected');
          if (target) {
            if (target.isPage) {
              const pageId = target.get('pageId');
              if (
                pageId !== undefined &&
                canvas.getActiveObjects().length === 0
              ) {
                canvasService.pageFocus(canvas, pages, pageId, isMobile);
              }
            } else {
              canvas.setActiveObject(target);
              canvas.renderAll();
            }
          } else {
            canvas.discardActiveObject();
            canvas.renderAll();
          }
          lastTouch = null;
          startTouch = null;
          initialPinchDistance = null;
          return;
        }

        const flickThreshold = 500;

        if (Math.abs(velocityY) > flickThreshold) {
          // Flick
          const direction = velocityY > 0 ? 'up' : 'down';
          snapToAdjacentPage(vpt, direction);
        } else {
          // Relâchement lent
          snapToNearestPage(vpt);
        }

        lastTouch = null;
        startTouch = null;
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
