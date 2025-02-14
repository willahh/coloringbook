import React, { useRef, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router';
import * as fabric from 'fabric';
// import { BookContext } from '../Book.context';
import { Page } from '@apptypes/book';
import { useEventHandlers } from './hooks/useEventHandlers';
import { useDimensions } from './hooks/useDimensions';
import { usePageSpread } from './hooks/usePageSpread';
import { usePageCreation } from './hooks/usePageCreation';
import canvasService from '@/services/canvas.service';
// import { useCanvasContext } from './hooks/useCanvasContext';
import { PagesNavigation } from '../components/PagesNavigation';

import { makeMouseWheel } from '@/lib/scrollbars/utils';
import { Scrollbars } from '@/lib/scrollbars';
import useCanvasContext from '../useCanvasContext';
import { BookPageParams } from '@/common/interfaces';
// interface CanvasState {
//   viewportTransform: fabric.TMat2D;
// }
interface SpreadCanvasProps {
  pageId: number;
  width?: number;
  height?: number;
  pages: Page[];
  sidePanelWidth: number;
  pagesPanelWidth: number;
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = ({
  pageId,
  pages,
  sidePanelWidth,
  pagesPanelWidth,
}) => {
  const pageParams = useParams<BookPageParams>();
  const { setCanvas } = useCanvasContext();

  // const { position, scale, viewportTransform } = useCanvasContext();

  // Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Context
  // const { setCanvas, pageParams /*, setPages */ } = useContext(BookContext);

  // const canvasService = useRef(new canvasService(dispatch));

  // State
  const canvasSize = useDimensions(
    containerRef,
    sidePanelWidth,
    pagesPanelWidth
  );

  // Process
  const { spreadPages } = usePageSpread(pages, pageParams);

  useEventHandlers(fabricCanvasRef.current);

  // const saveCanvasState = (canvas: fabric.Canvas): CanvasState => {
  //   console.log('#001 saveCanvasState', '=>', { ...canvas.viewportTransform });
  //   // TODO use context data
  //   return { viewportTransform: { ...canvas.viewportTransform } };
  // };

  // const restoreCanvasState = (
  //   canvas: fabric.Canvas,
  //   canvasState: CanvasState
  // ) => {
  //   console.log('#001 restoreCanvasState', canvasState.viewportTransform);
  //   canvas.setViewportTransform(canvasState.viewportTransform);
  // };

  /**
   * [Pages init].
   * The dependency array for pageCreation hook is only the canvas html reference.
   * Be cause the canvas is reset on browser resize, page change, or container changes.
   */
  const spreadSize = usePageCreation(
    fabricCanvasRef.current,
    spreadPages,
    canvasSize
  );

  /**
   * [Canvas init].
   * The canvas needs to be initialized with width and height in pixels.
   * Therefore, it must be refreshed when the browser is resized or the container size changes.
   *
   * The dependency array for when to update the effect includes pageSpread, meaning
   * that when the page changes, the entire canvas is reinitialized. This approach makes it easier
   * to manage updates for pages and graphic elements!
   */
  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) => {
      console.info('#001 CANVAS INIT');
      const canvas = new fabric.Canvas(canvasElement, {
        height: canvasSize.height,
        width: canvasSize.width - 50,
        selection: false,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
      });
      canvasService.canvas = canvas;
      return canvas;
    },
    [canvasSize, sidePanelWidth, pagesPanelWidth]
  );

  /**
   * [Canvas reset]
   */
  useEffect(() => {
    if (canvasRef.current) {
      console.info('#001 CANVAS RESET');
      fabricCanvasRef.current = initCanvas(canvasRef.current);
      const canvas = fabricCanvasRef.current as fabric.Canvas & {
        lastPosX?: number;
        lastPosY?: number;
      };
      // const canvasState = saveCanvasState(canvas);
      // setTimeout(() => {
      //   restoreCanvasState(canvasState);
      // }, 500);
      console.log('#10 reset canvas');
      setCanvas(canvas);

      const mousewheel = makeMouseWheel(canvas, { min: 0.02, max: 256 });
      canvas.on('mouse:wheel', mousewheel);

      const scrollbar = new Scrollbars(canvas, {
        fill: 'rgba(255,255,0,.5)',
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
  }, [initCanvas, setCanvas, canvasSize, spreadPages]);

  /**
   * Center the pages within the canvas when the page changes.
   * Dependency array :
   *  - spreadSize: Updated after pages and objects are drawn by usePageCreation
   *  - pageId: Triggered when a page changes
   */
  useEffect(() => {
    if (fabricCanvasRef.current) {
      const { x, y, scaleX, scaleY } = canvasService.calculateCenteredSpread(
        canvasSize,
        spreadSize
      );

      canvasService.applyViewportTransform(
        fabricCanvasRef.current,
        x,
        y,
        scaleX,
        scaleY
      );
    }
  }, [spreadSize, pageId]);

  return (
    <div ref={containerRef} className="relative flex-1">
      <PagesNavigation />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadViewerCanvas;
