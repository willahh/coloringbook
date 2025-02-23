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
  const { book } = useSelector(selectBook); // Pour accéder à l'état complet du livre

  // State –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const [needPageCenter, setNeedPageCenter] = useState<boolean>(true);
  const [needRedrawPages, setNeedRedrawPages] = useState<boolean>(true);
  const [hasInitializedThumbnails, setHasInitializedThumbnails] =
    useState(false);

  // Refs ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const canvas = fabricCanvasRef.current;

  // Process –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const canvasSize = useDimensions(
    containerRef,
    sidePanelWidth,
    pagesPanelWidth
  );

  console.log('\n\n#a SpreadViewerCanvas canvas:', canvas, canvas?.upperCanvasEl)

  // useEffect(() => {
  //   setNeedPageCenter(true);
  // }, [pageId]);

  // useMemo to avoid too many re-renders
  // const spreadPages = React.useMemo(
  //   () => BookService.getPageSpread(pageParams, pages),
  //   [pageParams, pages]
  // );
  const spreadPages = pages;

  useEventHandlers(fabricCanvasRef.current);

  /**
   * [Canvas instanciation]
   * The canvas needs to be initialized with width and height in pixels.
   * Therefore, it must be refreshed when the browser is resized or the container size changes.
   */
  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) => {
      const canvasNew = new fabric.Canvas(canvasElement, {
        height: canvasSize.height,
        width: canvasSize.width - 50,
        selection: false,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
      });

      console.log('#02 canvasNew');
      canvasService.canvas = canvasNew;
      setNeedRedrawPages(true);

      return canvasNew;
    },
    [canvasSize]
  );

  /**
   * [Canvas reset]
   */
  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);
      console.log('#a NEW CANVAS');
      const canvas = fabricCanvasRef.current as fabric.Canvas & {
        lastPosX?: number;
        lastPosY?: number;
      };
      console.log('#a set current canvas');

      setCanvas(canvas);

      // const mousewheel = makeMouseWheel(canvas, { min: 0.02, max: 256 });
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
        fabricCanvasRef.current = null;
      };
    }
  }, [initCanvas, setCanvas, spreadPages]);

  /**
   * [Canvas drawing].
   * Draw pages, elements and page mask.
   * The dependency array for pageCreation hook is only the canvas html reference.
   * Be cause the canvas is reset on browser resize, page change, or container changes.
   */
  useEffect(() => {
    if (canvas) {
      if (needRedrawPages) {
        console.log('#001 #a call redraw');

        const spreadSizeNew = canvasService.drawPagesElementsAndMask(
          canvas,
          spreadPages,
          canvasSize,
          appearance
        );

        // Center spread when viewportTransform is not defined (on page mount)
        if (spreadSizeNew && needPageCenter) {
          console.log('#001 FOCUS ON PAGE');
          const vpt = canvasService.focusOnPage(canvas, pageId);
          if (vpt) {
            setViewportTransform(vpt);
          }
          console.log('#001 set setNeedPageCenter to false');
          setNeedPageCenter(false);
        }
        setNeedRedrawPages(false);
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
    }
  }, [
    canvas,
    spreadPages,
    canvasSize,
    viewportTransform,
    needPageCenter,
    needRedrawPages,
    setViewportTransform,
  ]);

  /**
   * [Update page thumbnails]
   */
  useEffect(() => {
    if (!canvas) return; // Ne s'exécute qu'une seule fois si non initialisé

    const updateThumbnailForPage = async (pageId: number) => {
      const page = PageService.getPageById(book.pages, pageId);
      console.log('#a updateThumbnailForPage page:', page, canvas);

      if (!canvas.upperCanvasEl) {
        console.error('Canvas not initialized');
      }

      // const page = book.pages.find((p) => p.pageId === pageId);
      if (page) {
        console.log('#a page.pageId:', page.pageId);
        const pageRect = canvasService.getPageRectbyPageId(canvas, page.pageId);
        console.log('#a pageRect:', pageRect);
        if (pageRect) {
          const dimensions = {
            width: 100, // Taille fixe pour la preview
            height: 141,
          };
          // Attendre que les éléments soient dessinés (si besoin)
          await new Promise((resolve) => setTimeout(resolve, 20)); // Petit délai pour s'assurer que les éléments sont rendus
          const newThumbnail = await canvasService.generatePagePreview(
            page,
            dimensions
          );
          dispatch(
            updatePageThumbImageData({ thumbnails: { [pageId]: newThumbnail } })
          );
          setHasInitializedThumbnails(true); // Marquer comme initialisé
        }
      }
    };

    // Mettre à jour les vignettes pour toutes les pages
    if (!hasInitializedThumbnails && needRedrawPages === false) {
      for (const page of book.pages) {
        updateThumbnailForPage(page.pageId);
      }
    }

    const handleObjectModified = async () => {


      setTimeout(() => {
        console.log('#a handleObjectModified');
        const activeObject = canvas.getActiveObject();
        console.log('#a canvas', canvas)
        console.log('#a activeObject activeObject.pageId:', activeObject?.pageId);
        if (activeObject && 'pageId' in activeObject) {
          // Attendre que les éléments soient dessinés (si besoin)
          console.log('#a 01');
          // await new Promise((resolve) => setTimeout(resolve, 1000)); // Petit délai pour s'assurer que les éléments sont rendus
          console.log('#a 02');
          updateThumbnailForPage(activeObject.pageId as number);
        }
      }, 2000)
      
    };

    const handleObjectAdded = (e: fabric.IEvent) => {
      const object = e.target as fabric.Object;
      if (object && 'pageId' in object) {
        // updateThumbnailForPage(object.pageId as number);
      }
    };

    const handleObjectRemoved = (e: fabric.IEvent) => {
      const object = e.target as fabric.Object;
      if (object && 'pageId' in object) {
        // updateThumbnailForPage(object.pageId as number);
      }
    };

    console.log('#a add handler handleObjectModified');
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      // updateThumbnailForPage.cancel();
    };
  }, [
    canvas,
    appearance,
    dispatch,
    hasInitializedThumbnails,
    needRedrawPages,
    book.pages,
  ]);

  /**
   * [Focus on page when pageId changes]
   */
  useEffect(() => {
    if (canvas) {
      console.log('#001 pageId has changed !!!', pageId);

      const vpt = canvasService.focusOnPage(canvas, pageId);
      if (vpt) {
        // console.log('#001 start viewport transform animation');
        console.log('#001 FOCUS ON PAGE from pageId change');

        const currentVpt = canvas.viewportTransform.slice(); // Copier l'état actuel du viewport
        const targetVpt = vpt; // Vpt cible calculé précédemment

        // Appeler la fonction d'animation avec les valeurs nécessaires
        const cancelAnimation = canvasService.animateViewportTransform(
          canvas,
          currentVpt,
          targetVpt
        );
        console.log('#001 set setNeedPageCenter to false');
        setNeedPageCenter(false);

        // Nettoyage de l'animation si le composant se démonte ou si la pageId change
        return cancelAnimation;
      }
    }
  }, [pageId]); // pageId : déclencheur lorsque la page change

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
