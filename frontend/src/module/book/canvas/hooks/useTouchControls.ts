import { useEffect } from 'react';
import * as fabric from 'fabric';
import canvasService from '@/services/CanvasService';
import { Scrollbars } from '@/lib/scrollbars';
import useIsMobile from '@/common/hooks/useIsMobile';
import { useSelector } from '@/common/store';
import { selectBookPages } from '../../BookSlice';
import { useParams } from 'react-router-dom';

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
  const { pageId } = useParams<{ pageId?: string }>();
  const pageIdParam = Number(pageId);

  useEffect(() => {
    if (!canvas || !scrollbar) return;

    let lastTouch: { x: number; y: number; timestamp: number } | null = null;
    let startTouch: { x: number; y: number; timestamp: number } | null = null;
    let velocityX = 0;
    let velocityY = 0;
    let velocityZoom = 0; // Nouvelle variable pour la vitesse de zoom
    let lastZoom = 1.0; // Stocker le dernier zoom pour calculer la vitesse
    let lastPinchCenter: fabric.Point | null = null; // Stocker le dernier centre du pincement
    let animationFrameId: number | null = null;
    let initialPinchDistance: number | null = null;
    let isPinching = false;
    let isZoomed =
      canvas.getZoom() >
      canvasService.getZoomMin(canvas, pageIdParam, isMobile);

    // alert('isZoomed pageId: ' + pageIdParam + ' ' + canvas.getZoom() + ' - ' + canvasService.getZoomMin(canvas, pageIdParam, isMobile));

    const MOMENTUM_THRESHOLD = 100;
    const MOMENTUM_DAMPING = 0.95;
    const ZOOM_MOMENTUM_THRESHOLD = 0.1; // Seuil pour déclencher le momentum de zoom
    const ZOOM_MOMENTUM_DAMPING = 0.92; // Amortissement plus doux pour le zoom

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
          target?.isPage &&
          !isZoomed
        ) {
          const pageId = target.get('pageId');
          if (pageId !== undefined) {
            canvasService.pageFocus(canvas, pages, pageId, isMobile);
            // updateZoomState();
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
        isPinching = true;
        // updateZoomState();
        lastZoom = canvas.getZoom(); // Initialiser le dernier zoom
        lastPinchCenter = new fabric.Point(
          (touch1.clientX + touch2.clientX) / 2,
          (touch1.clientY + touch2.clientY) / 2
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

        // console.log('canvas.getZoom()', canvas.getZoom())

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
        isPinching = false;
      } else if (e.touches.length === 2) {
        const [touch1, touch2] = e.touches;
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );

        if (initialPinchDistance) {
          const now = Date.now();
          const deltaTime = lastTouch ? (now - lastTouch.timestamp) / 1000 : 0;
          const currentZoom = canvas.getZoom();
          const zoomFactor = currentDistance / initialPinchDistance;
          let zoom = currentZoom * zoomFactor;
          zoom = Math.max(0.02, Math.min(256, zoom));
          const zoomMin = canvasService.getZoomMin(
            canvas,
            pageIdParam,
            isMobile
          );

          const threashold = 0.6;
          if (zoom <= zoomMin - threashold) {
            console.log('zoom limit');
            zoom = currentZoom;
          }

          // Calculer la vitesse de zoom
          if (deltaTime > 0 && lastTouch) {
            velocityZoom = (zoom - lastZoom) / deltaTime;
          }

          // Calculer le centre du pincement
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;
          lastPinchCenter = new fabric.Point(centerX, centerY);

          canvas.zoomToPoint(lastPinchCenter, zoom);

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
          lastZoom = zoom;
          lastTouch = { x: touch1.clientX, y: touch1.clientY, timestamp: now };
          isPinching = true;
        }
      }
    };

    const snapToNearestPage = (startVpt: fabric.TMat2D) => {
      console.log('snapToNearestPage');
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

        if (distance < minDistance) {
          minDistance = distance;
          nearestPage = page;
        }
      });

      if (!nearestPage) {
        console.warn('No nearest page found');
        return;
      }

      const pageId = (nearestPage as fabric.Object).get('pageId');

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
          // updateZoomState();
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
        targetPage = pages[currentIndex - 1];
      } else if (direction === 'down' && currentIndex < pages.length - 1) {
        targetPage = pages[currentIndex + 1];
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
            // updateZoomState();
          }
        }
      } else {
        console.log('No adjacent page to snap to');
        snapToNearestPage(startVpt);
      }
    };

    const animateMomentum = (startVpt: fabric.TMat2D) => {
      const totalWidth = canvasService.getMaxPageWidth(canvas);
      const totalHeight = canvasService.getTotalPageHeightCumulated(
        canvas,
        isMobile
      );
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const zoom = canvas.getZoom();

      const vpt = startVpt.slice(0) as fabric.TMat2D;

      vpt[4] += velocityX * 0.016;
      vpt[5] += velocityY * 0.016;

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

      velocityX *= MOMENTUM_DAMPING;
      velocityY *= MOMENTUM_DAMPING;

      // console.log(
      //   `Momentum - velocityX: ${velocityX}, velocityY: ${velocityY}`
      // );

      if (Math.abs(velocityX) > 1 || Math.abs(velocityY) > 1) {
        animationFrameId = requestAnimationFrame(() => animateMomentum(vpt));
      } else {
        animationFrameId = null;
        canvas.__isPanning = false;
        updateObjectControls(false);
      }
    };

    const animateZoomMomentum = (startZoom: number) => {
      if (!lastPinchCenter) return;

      let currentZoom = startZoom;
      currentZoom += velocityZoom * 0.016; // Appliquer la vitesse de zoom
      currentZoom = Math.max(0.02, Math.min(256, currentZoom)); // Contraindre le zoom

      const zoomMin = canvasService.getZoomMin(canvas, pageIdParam, isMobile);
      console.log('#b currentZoom', currentZoom);
      console.log('#b zoomMin', zoomMin);

      if (currentZoom <= zoomMin) {
        console.log('animateZoomMomentum zoom limit min');
        return;
      }

      canvas.zoomToPoint(lastPinchCenter, currentZoom);

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
        totalWidth * currentZoom,
        vpt[4],
        isMobile
      );
      vpt[5] = canvasService.constrainVerticalMovement(
        canvasHeight,
        totalHeight * currentZoom,
        vpt[5],
        isMobile
      );

      setViewportTransform([...vpt]);
      canvas.setViewportTransform(vpt);
      canvas.requestRenderAll();

      velocityZoom *= ZOOM_MOMENTUM_DAMPING; // Amortir la vitesse de zoom

      if (Math.abs(velocityZoom) > ZOOM_MOMENTUM_THRESHOLD) {
        animationFrameId = requestAnimationFrame(() =>
          animateZoomMomentum(currentZoom)
        );
      } else {
        animationFrameId = null;
        // updateZoomState();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0 && lastTouch && startTouch) {
        const activeObject = canvas.getActiveObject();
        const target = canvas.findTarget(e);

        if (activeObject && target === activeObject) {
          isPinching = false;
          return;
        }

        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }

        const vpt = canvas.viewportTransform?.slice(0) as fabric.TMat2D;
        if (!vpt) {
          console.warn('#b Viewport transform not available');
          lastTouch = null;
          startTouch = null;
          initialPinchDistance = null;
          isPinching = false;
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

        const isZoomed =
          canvas.getZoom() >
          canvasService.getZoomMin(canvas, pageIdParam, isMobile);

        if (isTap && !isPinching && !isZoomed) {
          if (target) {
            if (target.isPage) {
              const pageId = target.get('pageId');
              if (
                pageId !== undefined &&
                canvas.getActiveObjects().length === 0
              ) {
                canvasService.pageFocus(canvas, pages, pageId, isMobile);
                // isZoomed =
                //   canvas.getZoom() >
                //   canvasService.getZoomMin(canvas, pageIdParam, isMobile);
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
          isPinching = false;
          return;
        }

        console.log('isPinching', isPinching);

        if (isPinching) {
          if (
            Math.abs(velocityZoom) > ZOOM_MOMENTUM_THRESHOLD &&
            lastPinchCenter
          ) {
            console.log('Zoom momentum triggered with velocity:', velocityZoom);

            animationFrameId = requestAnimationFrame(() =>
              animateZoomMomentum(canvas.getZoom())
            );
          } else {
            console.log('Zoom momentum not triggered - velocity too low');
          }
          lastTouch = null;
          startTouch = null;
          initialPinchDistance = null;
          isPinching = false;
        } else if (!isZoomed) {
          console.log('#b lancer un flick');
          const flickThreshold = 500;

          if (Math.abs(velocityY) > flickThreshold) {
            const direction = velocityY > 0 ? 'up' : 'down';
            snapToAdjacentPage(vpt, direction);
          } else {
            snapToNearestPage(vpt);
          }

          lastTouch = null;
          startTouch = null;
          initialPinchDistance = null;
          isPinching = false;
        } else {
          if (
            Math.abs(velocityX) > MOMENTUM_THRESHOLD ||
            Math.abs(velocityY) > MOMENTUM_THRESHOLD
          ) {
            console.log('Momentum triggered');
            animationFrameId = requestAnimationFrame(() =>
              animateMomentum(vpt)
            );
          } else {
            console.log('Momentum not triggered - velocity too low');
            canvas.__isPanning = false;
            updateObjectControls(false);
          }
        }
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

    const updateZoomState = () => {
      isZoomed =
        canvas.getZoom() >
        canvasService.getZoomMin(canvas, pageIdParam, isMobile);
    };

    const handleZoomChange = () => {
      updateZoomState();
    };
    canvas.on('after:render', handleZoomChange);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      upperCanvas.removeEventListener('touchstart', handleTouchStart);
      upperCanvas.removeEventListener('touchmove', handleTouchMove);
      upperCanvas.removeEventListener('touchend', handleTouchEnd);
      // canvas.off('after:render', handleZoomChange);
      delete canvas.__isPanning;
      delete canvas.lastTapTime;
      delete canvas.lastTapTarget;
      updateObjectControls(false);
    };
  }, [canvas, scrollbar, setViewportTransform, isMobile]);
}
