import { useEffect } from 'react';
import * as fabric from 'fabric';
import canvasService from '@/services/canvas.service';
import { Scrollbars } from '@/lib/scrollbars';
import useIsMobile from '@/common/hooks/useIsMobile';

interface UseTouchControlsProps {
  canvas: fabric.Canvas | null;
  scrollbar: Scrollbars | null;
  setViewportTransform: React.Dispatch<
    React.SetStateAction<fabric.TMat2D | undefined>
  >;
}
// Étendre l'interface de fabric.Canvas pour TypeScript
declare module 'fabric' {
  interface Canvas {
    __isPanning?: boolean;
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

    // Fonction pour désactiver/réactiver les contrôles des objets
    const updateObjectControls = (isPanning: boolean) => {
      canvas.getObjects().forEach((obj) => {
        if (obj.type !== 'rect' || !obj.isPage) {
          // Exclure les pageRect
          obj.set({
            hasControls: !isPanning,
            hasBorders: !isPanning,
            selectable: !isPanning,
            evented: !isPanning, // Désactive les événements si pan en cours
          });
        }
      });
      canvas.renderAll();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 2) return;
      if (e.touches.length === 1) {
        lastTouch = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          timestamp: Date.now(),
        };
        canvas.__isPanning = false; // Réinitialise au début du toucher
        updateObjectControls(false); // Réactiver les contrôles au début
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId); // Arrête toute animation en cours
          animationFrameId = null;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        !canvas.viewportTransform ||
        e.touches.length !== 1 ||
        scrollbar['_bar'] ||
        canvas.getActiveObject() // Désactiver le pan si un objet est en édition
      )
        return;
      e.preventDefault();
      console.log('handleTouchMove');

      const touch = e.touches[0];
      const now = Date.now();
      const deltaTime = lastTouch ? (now - lastTouch.timestamp) / 1000 : 0; // Temps en secondes
      const deltaX = touch.clientX - (lastTouch?.x || touch.clientX);
      const deltaY = touch.clientY - (lastTouch?.y || touch.clientY);

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        canvas.__isPanning = true; // Marque comme pan si déplacement significatif
        updateObjectControls(true); // Désactiver les contrôles pendant le pan
      }

      // Calcul de la vitesse (pixels par seconde)
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
    };

    const applyMomentum = () => {
      if (
        !canvas.viewportTransform ||
        (Math.abs(velocityX) < 1 && Math.abs(velocityY) < 1)
      ) {
        animationFrameId = null;
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

      // Applique le déplacement avec la vitesse actuelle
      const x = vpt[4] + velocityX * 0.016; // 0.016 ≈ 1/60s pour 60 FPS
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

      // Réduit la vitesse (friction)
      velocityX *= 0.95; // Décélération (ajuste cette valeur pour plus/moins d'inertie)
      velocityY *= 0.95;

      animationFrameId = requestAnimationFrame(applyMomentum);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0 && lastTouch) {
        // Lance le momentum si la vitesse est significative
        if (Math.abs(velocityX) > 50 || Math.abs(velocityY) > 50) {
          // Seuil ajustable
          animationFrameId = requestAnimationFrame(applyMomentum);
        }
        lastTouch = null;
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
      updateObjectControls(false); // Réactiver au démontage
    };
  }, [canvas, scrollbar, setViewportTransform]);
}
