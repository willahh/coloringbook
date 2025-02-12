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
        width: canvasSize.width,
        selection: true,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
      });
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

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [initCanvas, setCanvas, canvasSize, spreadPages]);

  /**
   * Canvas position and scale
   */
  // useEffect(() => {
  //   if (fabricCanvasRef.current) {
  //     // const { x, y, scaleX, scaleY } = canvasService.calculateCenteredSpread(
  //     //   canvasSize,
  //     //   spreadSize
  //     // );

  //     // const x = position.x;
  //     // const y = position.y;
  //     // const scaleX = scale.scaleX;
  //     // const scaleY = scale.scaleY;

  //     const x = viewportTransform[4];
  //     const y = viewportTransform[5];
  //     // const scaleX = viewportTransform[0];
  //     // const scaleY = viewportTransform[3];
  //     // setPosition({ x: vpt[4], y: vpt[5] });
  //     // setScale({ scaleX: vpt[0], scaleY: vpt[3] });

  //     console.log('#11 useEffect scale:', scale);
  //     fabricCanvasRef.current.lastPosX = x;
  //     fabricCanvasRef.current.lastPosY = y;
  //     // fabricCanvasRef.current.viewportTransform = [scaleX, 0, 0, scaleY, x, y];
  //     console.log('#10 assign viewportTransform', viewportTransform);
  //     // fabricCanvasRef.current.viewportTransform = viewportTransform;

  //     // canvasService.calculateCenteredSpread();
  //   }
  // }, [position, scale]);

  /**
   * Canvas position and scale
   */
  // useLayoutEffect(() => {
  //   console.log(`#3.1 useLayoutEffect pageId has changed ! pageId: ${pageId}`);
  //   if (fabricCanvasRef.current) {
  //     const { x, y, scaleX, scaleY } = canvasService.calculateCenteredSpread(
  //       canvasSize,
  //       spreadSize
  //     );

  //     fabricCanvasRef.current.lastPosX = x;
  //     fabricCanvasRef.current.lastPosY = y;
  //     fabricCanvasRef.current.viewportTransform = [scaleX, 0, 0, scaleY, x, y];
  //   }
  // }, [pages]);

  // useEffect(() => {
  //   console.log('#10 useEffect pageId changed to:', pageId);
  // }, [pageId]);

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
