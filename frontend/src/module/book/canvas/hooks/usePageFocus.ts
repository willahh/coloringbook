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
    console.log('#c2 usePageFocus.ts', canvas)
    if (!canvas) return;

    if (disableFocusAnimation) {
      return;
    }

    console.log('#c2 useEffecrt usePageFocus call pageFocus')
    const cancelAnimation = canvasService.pageFocus(canvas, pages, pageId);

    return cancelAnimation;
  }, [canvas, pageId]); // Canvas et pageId doivent être présent
};

export default usePageFocus;
