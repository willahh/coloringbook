import React, { useRef, useEffect, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import {
  // makeMouseWheel,
  makeMouseWheelWithAnimation,
} from '@/lib/scrollbars/utils';

import { Page } from '@apptypes/book';
import { useTheme } from '@/common/contexts/ThemeContext';
import { useDispatch, useSelector } from '@/common/store';
import canvasService from '@/services/canvas.service';
import { Scrollbars } from '@/lib/scrollbars';
import { BookPageParams } from '@/common/interfaces';

import { useEventHandlers } from './hooks/useEventHandlers';
import { useDimensions } from './hooks/useDimensions';
import { PagesNavigation } from '../components/PagesNavigation';

import useCanvasContext from '../useCanvasContext';
import { updatePageThumbImageData } from '../Book.actions';
import { selectBook } from '../Book.slice';
import { PageService } from '@/services/page.service';

interface SpreadCanvasProps {
  // pageId: number;
  width?: number;
  height?: number;
  pages: Page[];
  sidePanelWidth: number;
  pagesPanelWidth: number;
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = ({
  // pageId,
  pages,
  sidePanelWidth,
  pagesPanelWidth,
}) => {
  const pageParams = useParams<BookPageParams>();
  const pageId = pageParams.pageId ? parseInt(pageParams.pageId) : 0;
  const { canvas, setCanvas, viewportTransform, setViewportTransform } =
    useCanvasContext();
  const { appearance } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { book } = useSelector(selectBook); // Pour accéder à l'état complet du livre

  // State –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const [needPageCenter, setNeedPageCenter] = useState<boolean>(true);
  const [needRedrawPages, setNeedRedrawPages] = useState<boolean>(true);
  const [hasInitializedThumbnails, setHasInitializedThumbnails] =
    useState(false);

  // Refs ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const canvasRef = useRef<HTMLCanvasElement>();
  // const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const canvas = fabricCanvasRef.current;

  // Process –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const canvasSize = useDimensions(
    containerRef,
    sidePanelWidth,
    pagesPanelWidth
  );

  const spreadPages = pages;

  /**
   * [Canvas.initialize]
   * Only one instanciation on component mount
   */
  useEffect(() => {
    if (canvasRef.current) {
      console.log('#c INSTANCIATE OF A NEW CANVAS');

      const container = canvasRef.current.closest('main');
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: container?.clientWidth,
        height: container?.clientHeight,
        selection: false,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
        backgroundColor: 'red',
      });

      setCanvas(canvas);
      setNeedRedrawPages(true);
      canvasService.canvas = canvas;

      // Initialize mousewheel pan and zoom
      const mousewheel = makeMouseWheelWithAnimation(
        canvas,
        {
          min: 0.02,
          max: 256,
        },
        true,
        setViewportTransform
      );
      canvas.on('mouse:wheel', mousewheel);

      // Initialize virtual scrollbars
      const scrollbar = new Scrollbars(canvas, {
        fill: '#f43f5f',
        stroke: 'rgba(0,0,255,.5)',
        lineWidth: 5,
        scrollbarSize: 8,
        offsetY: 62, // Footer height
      });

      return () => {
        scrollbar.dispose();
        canvas.off('mouse:wheel', mousewheel);
        canvas.dispose();
      };
    }
  }, []); // Keep empty to run only once

  /**
   * [Canvas.onWindowResize]
   */
  useEffect(() => {
    console.log('#c RESIZE CANVAS');
    canvas?.setDimensions({
      width: canvasSize.width,
      height: canvasSize.height,
    });
  }, [canvasSize]);

  /**
   * [Canvas.addEventHandlers]
   */
  useEventHandlers(canvas);

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
        spreadPages,
        canvasSize,
        appearance
      );
      setNeedRedrawPages(false);

      // Center spread when viewportTransform is not defined (on page mount)
      // if (spreadSizeNew && needPageCenter) {
      //   const vpt = canvasService.getPageFocusCoordinates(canvas, pageId);
      //   if (vpt) {
      //     setViewportTransform(vpt);
      //   }
      //   setNeedPageCenter(false);
      // }
    }

    // Mettre à jour le viewport et détecter la page actuelle
    if (viewportTransform) {
      canvas.viewportTransform = viewportTransform;
      canvas.requestRenderAll();

      // Délai pour éviter plusieurs navigations rapides
      const timeoutId = setTimeout(() => {
        canvasService.detectCurrentPage(canvas, (id: number) => {
          // Lorsque la page actuelle est détectée, naviguer vers la page
          // Si la page actuelle est différente de la page actuelle
          if (id !== pageId) {
            // Si le canvas n'est pas en train de défiler
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

    // canvasSize,
    // spreadPages,
    // needRedrawPages,
    // setViewportTransform,
    // needPageCenter,
  ]);

  /**
   * [Focus on page when pageId changes]
   */
  useEffect(() => {
    if (canvas) {
      let focusPageId = pageId;
      if (focusPageId === 0) {
        focusPageId = pages[0].pageId;
      }

      const vpt = canvasService.getPageFocusCoordinates(canvas, focusPageId);
      if (vpt) {
        console.log('#c FOCUS ON PAGE pageId:', pageId);
        const currentVpt = [...canvas.viewportTransform];
        const targetVpt = vpt;

        const cancelAnimation = canvasService.animateViewportTransform(
          canvas,
          currentVpt,
          targetVpt
        );
        setNeedPageCenter(false);

        return cancelAnimation;
      }
    }
  }, [canvas, pageId]);

  // /**
  //  * [Update page thumbnails]
  //  */
  // useEffect(() => {
  //   console.log('\n#a => useEffect for update page thumbnails');
  //   console.log('#a canvas.getObjects():', canvas?.getObjects());
  //   console.log('#a3 pages[1].elements[0]', pages[1].elements[0]);

  //   if (!canvas) return; // Ne s'exécute qu'une seule fois si non initialisé

  //   const updateThumbnailForPage = async (
  //     canvas: fabric.Canvas,
  //     pageId: number
  //   ) => {
  //     const page = PageService.getPageById(pages, pageId);
  //     console.log('#a updateThumbnailForPage page:', page, canvas);

  //     if (!canvas.upperCanvasEl) {
  //       console.error('Canvas not initialized');
  //     }

  //     // const page = book.pages.find((p) => p.pageId === pageId);
  //     if (page) {
  //       const pageRect = canvasService.getPageRectbyPageId(canvas, page.pageId);
  //       console.log('#a2 pageRect', pageRect);
  //       if (pageRect) {
  //         const dimensions = {
  //           width: 100, // Taille fixe pour la preview
  //           height: 141,
  //         };

  //         // Attendre que les éléments soient dessinés (si besoin)
  //         setTimeout(async () => {
  //           // await new Promise((resolve) => setTimeout(resolve, 20)); // Petit délai pour s'assurer que les éléments sont rendus
  //           const newThumbnail = await canvasService.generatePagePreview(
  //             page,
  //             dimensions
  //           );
  //           //debugger;
  //           console.log('#a2', newThumbnail);
  //           console.log('#a2 page', page);
  //           dispatch(
  //             updatePageThumbImageData({
  //               thumbnails: { [pageId]: newThumbnail },
  //             })
  //           );
  //           setHasInitializedThumbnails(true); // Marquer comme initialisé
  //         }, 1000);
  //       }
  //     }
  //   };

  //   // Mettre à jour les vignettes pour toutes les pages
  //   if (!hasInitializedThumbnails && needRedrawPages === false) {
  //     for (const page of pages) {
  //       updateThumbnailForPage(canvas, page.pageId);
  //     }
  //   }

  //   const handleObjectModified = (canvas: fabric.Canvas, pages: Page[]) => {
  //     // console.log('\n#a3 >>>>> handleObjectModified');
  //     console.log('#a3 pages[1].elements[0]', pages[1].elements[0]);
  //     console.log('#a canvas.getObjects():', canvas?.getObjects());
  //     setTimeout(() => {
  //       console.log('\n#a3 >>>>> handleObjectModified');
  //       console.log('#a3 pages[1].elements[0]', pages[1].elements[0]);
  //       const activeObject = canvas.getActiveObject();
  //       if (activeObject && 'pageId' in activeObject) {
  //         // Attendre que les éléments soient dessinés (si besoin)
  //         console.log('#a 01');
  //         // await new Promise((resolve) => setTimeout(resolve, 1000)); // Petit délai pour s'assurer que les éléments sont rendus
  //         console.log('#a 02');
  //         updateThumbnailForPage(canvas, activeObject.pageId as number);
  //       }
  //     }, 500);
  //   };

  //   const handleObjectAdded = (e: fabric.IEvent) => {
  //     const object = e.target as fabric.Object;
  //     if (object && 'pageId' in object) {
  //       // updateThumbnailForPage(object.pageId as number);
  //     }
  //   };

  //   const handleObjectRemoved = (e: fabric.IEvent) => {
  //     const object = e.target as fabric.Object;
  //     if (object && 'pageId' in object) {
  //       // updateThumbnailForPage(object.pageId as number);
  //     }
  //   };

  //   console.log('#a add handler handleObjectModified', 'canvas:', canvas);
  //   console.log('#a3 >>>>>> pages[1].elements[0]', pages[1].elements[0]);

  //   const handleObjectModifiedRef = () => {
  //     handleObjectModified(canvas, pages);
  //   };

  //   // setTimeout(() => {
  //   canvas.on('object:modified', handleObjectModifiedRef);
  //   // }, 1000);

  //   canvas.on('object:added', handleObjectAdded);
  //   canvas.on('object:removed', handleObjectRemoved);

  //   return () => {
  //     canvas.off('object:modified', handleObjectModifiedRef);
  //     canvas.off('object:added', handleObjectAdded);
  //     canvas.off('object:removed', handleObjectRemoved);
  //     // updateThumbnailForPage.cancel();
  //   };
  // }, [
  //   canvas,
  //   appearance,
  //   dispatch,
  //   hasInitializedThumbnails,
  //   needRedrawPages,
  //   pages,
  //   // book.pages,
  // ]);

  return (
    <div ref={containerRef} className="relative flex-1">
      <PagesNavigation />
      <canvas ref={canvasRef} />

      <div
        data-id="inline-toolbar"
        className={`absolute bottom-20 left-12 z-10
          rounded-full px-4 py-2
         bg-secondary-500 dark:bg-secondary-500  text-white dark:text-white
         text-sm flex gap-2`}
      >
        <button>Modification</button>
        <button>Color</button>
        <button>Border color</button>
        <button>Border style</button>
        <button>Border radius</button>
        <button>Lock</button>
        <button>Duplicate</button>
        <button>Delete</button>
        <button>Plus</button>
      </div>
    </div>
  );
};

export default SpreadViewerCanvas;
