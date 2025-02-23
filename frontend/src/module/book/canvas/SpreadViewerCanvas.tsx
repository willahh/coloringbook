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

import { useCanvasInitialization } from './hooks/useCanvasInitialization';
import { useCanvasResize } from './hooks/useCanvasResize';
import { useCanvasRedraw } from './hooks/useCanvasRedraw';
import usePageFocus from './hooks/usePageFocus';
import useUpdatePageThumbnails from './hooks/useUpdatePageThumbnails';
import { U } from 'node_modules/react-router/dist/development/fog-of-war-D6dP9JIt.d.mts';

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

  // const spreadPages = pages;

  // Utilisation des hooks
  useCanvasInitialization(canvasRef);
  useCanvasResize(canvas, canvasSize);
  useEventHandlers(canvas);
  useCanvasRedraw(
    canvas,
    viewportTransform,
    setNeedRedrawPages,
    pageId,
    needRedrawPages,
    pages,
    canvasSize,
    appearance
  );
  usePageFocus(canvas, pages, pageId, setNeedPageCenter);
  useUpdatePageThumbnails(
    canvas,
    pages,
    setHasInitializedThumbnails,
    hasInitializedThumbnails,
    needRedrawPages
  );

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
