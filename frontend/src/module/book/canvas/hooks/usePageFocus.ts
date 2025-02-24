import * as fabric from 'fabric';
import { Page } from '@/common/types/book';
import canvasService from '@/services/canvas.service';
import { useEffect } from 'react';

const usePageFocus = (
  canvas: fabric.Canvas | null,
  pages: Page[],
  pageId: number,
  disableFocusAnimation?: boolean // Paramètre optionnel pour désactiver l'animation
) => {
  /**
   * [Focus page when pageId change]
   */
  useEffect(() => {
    if (!canvas) return;

    if (disableFocusAnimation) {
      return;
    }
    let focusPageId = pageId;
    if (focusPageId === 0) {
      focusPageId = pages[0].pageId;
    }

    const vpt = canvasService.getPageFocusCoordinates(canvas, focusPageId);
    if (vpt) {
      console.log('#c2 FOCUS ON PAGE pageId:', pageId);
      const currentVpt = [...canvas.viewportTransform];
      const targetVpt = vpt;

      const cancelAnimation = canvasService.animateViewportTransform(
        canvas,
        currentVpt,
        targetVpt
      );

      return cancelAnimation;
    }
  }, [canvas, pageId]);
};

export default usePageFocus;
