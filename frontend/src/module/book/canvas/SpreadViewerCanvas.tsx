import React, { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import { Page } from '@apptypes/book';
import { BookPageParams } from '@/common/interfaces';

import { useEventHandlers } from './hooks/useEventHandlers';
import { useDimensions } from './hooks/useDimensions';
import { PagesNavigation } from '../components/PagesNavigation';

import useCanvasContext from '../useCanvasContext';
import { useCanvasInitialization } from './hooks/useCanvasInitialization';
import { useCanvasResize } from './hooks/useCanvasResize';
import { useCanvasRedraw } from './hooks/useCanvasRedraw';
import usePageFocus from './hooks/usePageFocus';
import usePageAutoFocus from './hooks/usePageAutofocus';
import useNavigateToFirstPage from './hooks/useNavigateToFirstPage';
import useIsMobile from '@/common/hooks/useIsMobile';
import { debounce } from 'lodash';
import canvasService from '@/services/CanvasService';
import SvgShapeList from './../components/SvgShapeList'; // Importer le nouveau composant

interface SpreadCanvasProps {
  width?: number;
  height?: number;
  pages: Page[];
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = ({ pages }) => {
  const pageParams = useParams<BookPageParams>();
  const pageIdParams = pageParams.pageId ? parseInt(pageParams.pageId) : 0;
  const { viewportTransform } = useCanvasContext();
  const isMobile = useIsMobile();

  // State
  const [needRedrawPages, setNeedRedrawPages] = useState<boolean>(true);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [showShapeList, setShowShapeList] = useState<boolean>(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Process
  const pageId = pageIdParams;

  // Effects
  const canvas = useCanvasInitialization(canvasRef);
  useNavigateToFirstPage(canvas, pages);
  const canvasSize = useDimensions(containerRef);

  useEffect(() => {
    const updateCustom = debounce(() => {
      if (canvas) {
        if (canvas?.getZoom() <= 1) {
          canvasService.pageFocus(canvas, pages, pageId, isMobile);
        }
      }
    }, 200);

    updateCustom();

    return () => {
      updateCustom.cancel();
    };
  }, [canvasSize]);

  useCanvasResize(canvas, canvasSize);
  useEventHandlers(canvas);
  useCanvasRedraw(
    canvas,
    viewportTransform,
    setNeedRedrawPages,
    needRedrawPages,
    pages,
    canvasSize
  );

  const { disableFocusAnimation } = usePageAutoFocus(
    canvas,
    pageId,
    viewportTransform
  );
  usePageFocus(canvas, pages, pageId, isMobile, disableFocusAnimation);

  // FIXME: Finaliser ce useEffect, il faut charger toute les vignettes une seule fois
  // lorsqu'elles n'existent pas et les stoquer quelque part. Peut être dans
  // le navigateur avec storage.
  // useUpdatePageThumbnails(canvas, pages, needRedrawPages);

  // Gérer la sélection d'un objet
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (e: SelectionEvent) => {
      const activeObject =
        e.selected && e.selected.length > 0 ? e.selected[0] : null;
      setSelectedObject(activeObject);
      setShowShapeList(!!activeObject);
    };

    const handleDeselection = () => {
      setSelectedObject(null);
      setShowShapeList(false);
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleDeselection);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleDeselection);
    };
  }, [canvas]);

  //console.log('showShapeList', showShapeList)

  return (
    <ErrorBoundary fallback={<div>sd</div>}>
      <div
        ref={containerRef}
        data-id="cb-canvas-wrapper"
        className="relative flex-1"
      >
        <PagesNavigation />
        <canvas ref={canvasRef} className="w-full h-full" />
        {showShapeList && (
          <SvgShapeList
            canvas={canvas}
            selectedObject={selectedObject}
            onClose={() => setShowShapeList(false)}
          />
        )}
        {/* <div
          data-id="inline-toolbar"
          className={`hidden sm:block absolute bottom-20 right-12 z-10
          rounded-full px-4 py-2
         bg-secondary-500 dark:bg-secondary-500  text-white dark:text-white
         text-sm  gap-2`}
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
        </div> */}
      </div>
    </ErrorBoundary>
  );
};

export default SpreadViewerCanvas;
