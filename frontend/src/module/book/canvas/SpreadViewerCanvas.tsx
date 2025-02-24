import React, { useRef, useState } from 'react';
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
import useUpdatePageThumbnails from './hooks/useUpdatePageThumbnails';
import usePageAutoFocus from './hooks/usePageAutofocus';

interface SpreadCanvasProps {
  width?: number;
  height?: number;
  pages: Page[];
  sidePanelWidth: number;
  pagesPanelWidth: number;
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = ({
  pages,
  sidePanelWidth,
  pagesPanelWidth,
}) => {
  const pageParams = useParams<BookPageParams>();
  const pageId = pageParams.pageId ? parseInt(pageParams.pageId) : 0;
  const { canvas, viewportTransform } = useCanvasContext();

  // State –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const [needRedrawPages, setNeedRedrawPages] = useState<boolean>(true);

  // Refs ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Process –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const canvasSize = useDimensions(
    containerRef,
    sidePanelWidth,
    pagesPanelWidth
  );

  // Hooks –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  useCanvasInitialization(canvasRef);
  useCanvasResize(canvas, canvasSize);
  useEventHandlers(canvas);
  useCanvasRedraw(
    canvas,
    viewportTransform,
    setNeedRedrawPages,
    // pageId,
    needRedrawPages,
    pages,
    canvasSize
  );
  usePageFocus(canvas, pages, pageId);
  useUpdatePageThumbnails(canvas, pages, needRedrawPages);
  usePageAutoFocus(canvas, pageId, viewportTransform);

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
