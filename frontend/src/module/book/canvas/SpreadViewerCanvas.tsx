/**
 * SpreadViewerCanvas component is responsible for rendering a fabric.js canvas
 * within a resizable container. It initializes the canvas, sets up event handlers,
 * and manages the dimensions of the canvas based on the container size.
 *
 * @component
 * @example
 * return (
 *   <SpreadViewerCanvas width={800} height={600} />
 * )
 *
 * @param {Object} props - Component props
 * @param {number} [props.width] - Optional width of the canvas
 * @param {number} [props.height] - Optional height of the canvas
 *
 * @returns {JSX.Element} The rendered SpreadViewerCanvas component
 *
 * @remarks
 * This component uses the `fabric` library to create and manage the canvas.
 * It also uses `lodash` for debouncing the resize event handler.
 *
 * @see {@link https://github.com/fabricjs/fabric.js/|fabric.js}
 * @see {@link https://lodash.com/docs/4.17.15#debounce|lodash.debounce}
 */

import React, { useRef, useEffect, useCallback, useContext } from 'react';
import * as fabric from 'fabric';
import { BookContext } from '../Book.context';
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
  // const { position, scale, viewportTransform } = useCanvasContext();

  // Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Context
  const { setCanvas, pageParams /*, setPages */ } = useContext(BookContext);
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
  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);
      const canvas = fabricCanvasRef.current as fabric.Canvas & {
        lastPosX?: number;
        lastPosY?: number;
      };
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

  // useEffect(() => {
  //   if (!containerRef.current) return;

  //   const container = containerRef.current;
  //   const fabricCanvas = fabricCanvasRef.current;
  //   if (!fabricCanvas) return;

  //   const onScroll = () => {
  //     const vpt = fabricCanvas.viewportTransform!;

  //     if (!vpt) return;

  //     vpt[4] = -container.scrollLeft;
  //     vpt[5] = -container.scrollTop;
  //     fabricCanvas.requestRenderAll();
  //   };

  //   container.addEventListener('scroll', onScroll);

  //   return () => {
  //     container.removeEventListener('scroll', onScroll);
  //   };
  // }, []);
  return (
    <div ref={containerRef} className="relative flex-1">
      <PagesNavigation />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadViewerCanvas;
