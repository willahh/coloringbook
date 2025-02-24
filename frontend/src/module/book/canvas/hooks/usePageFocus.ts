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
    const cancelAnimation = canvasService.pageFocus(
      canvas,
      pages,
      pageId,
    );

    return cancelAnimation;
  }, [canvas, pageId]);
};

export default usePageFocus;
