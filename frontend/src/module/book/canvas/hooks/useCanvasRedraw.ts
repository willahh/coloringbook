import { useEffect } from 'react';
import * as fabric from 'fabric';
// import { useNavigate, useParams } from 'react-router-dom';
import canvasService from '@/services/canvas.service';
import { Page } from '@apptypes/book';
// import { BookPageParams } from '@/common/interfaces';

import { useTheme } from '@/common/contexts/ThemeContext';
import { RootState, useSelector } from '@/common/store';
import { selectAllElements } from '../../Book.slice';

export function useCanvasRedraw(
  canvas: fabric.Canvas | null,
  viewportTransform: fabric.TMat2D | undefined,
  setNeedRedrawPages: (value: boolean) => void,
  // pageId: number,
  needRedrawPages: boolean,
  pages: Page[],
  canvasSize: { width: number; height: number }
) {
  // const pageParams = useParams<BookPageParams>();
  // const navigate = useNavigate();
  const { appearance } = useTheme();

  /**
   * Redessine le canvas après mise à jour d'un élément d'une page
   */
  const allElements = useSelector((state: RootState) =>
    selectAllElements(state)
  );

  useEffect(() => {
    console.log('#z elements on page has changed');
    if (allElements) {
      console.log('#z Elements updated, redrawing canvas');
      setNeedRedrawPages(true);
    }
  }, [allElements]);

  /**
   * [Canvas.redrawPages]
   * Draw pages, elements and page mask
   */
  useEffect(() => {
    if (!canvas) return;
    if (needRedrawPages) {
      console.log('#c REDRAW PAGES');
      canvasService.drawPagesElementsAndMask(
        canvas,
        pages,
        canvasSize,
        appearance
      );
      setNeedRedrawPages(false);
    }

    // if (viewportTransform) {
    //   canvas.viewportTransform = viewportTransform;
    //   canvas.requestRenderAll();
    // }
  }, [
    canvas,
    viewportTransform,
    needRedrawPages
  ]);
}
