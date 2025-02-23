import { useEffect } from 'react';
import * as fabric from 'fabric';
import { useNavigate, useParams } from 'react-router-dom';
import canvasService from '@/services/canvas.service';
import { Page } from '@apptypes/book';
import { BookPageParams } from '@/common/interfaces';

import { useTheme } from '@/common/contexts/ThemeContext';
import { RootState, useSelector } from '@/common/store';
import { selectElements, selectAllElements } from '../../Book.slice';

export function useCanvasRedraw(
  canvas: fabric.Canvas | null,
  viewportTransform: fabric.TMat2D | undefined,
  setNeedRedrawPages: (value: boolean) => void,
  pageId: number,
  needRedrawPages: boolean,
  pages: Page[],
  canvasSize: { width: number; height: number }
) {
  const pageParams = useParams<BookPageParams>();
  const navigate = useNavigate();
  const { appearance } = useTheme();

  /**
   * Redessine le canvas après mise à jour d'un élément d'une page
   */
  // const currentPageId = Number(pageParams.pageId);
  // const elements = useSelector((state: RootState) =>
  //   selectElements(state, currentPageId)
  // );
  const allElements = useSelector((state: RootState) =>
    selectAllElements(state)
  );

  //console.log('#z allElements', allElements)

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
      console.log('#c#z REDRAW PAGES');
      canvasService.drawPagesElementsAndMask(
        canvas,
        pages,
        canvasSize,
        appearance
      );
      setNeedRedrawPages(false);
    }

    if (viewportTransform) {
      canvas.viewportTransform = viewportTransform;
      canvas.requestRenderAll();

      /**
       * [feature: Page auto focus on scroll]
       */
      const timeoutId = setTimeout(() => {
        canvasService.detectCurrentPage(canvas, (id: number) => {
          if (id !== pageId) {
            if (!canvas.get('scrolling')) {
              navigate(`/book/${pageParams.bookId}/pages/${id}`);
            }
          }
        });
      }, 24);
      return () => clearTimeout(timeoutId);
    }
  }, [
    canvas,
    viewportTransform,
    needRedrawPages,

    // canvasSize,
    // spreadPages,
    // needRedrawPages,
    // setViewportTransform,
    // needPageCenter,
  ]);
}
