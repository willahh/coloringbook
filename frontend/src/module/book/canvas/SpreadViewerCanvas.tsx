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
import { BookContext } from '../book.context';
import { Page } from '@/types/book';
import { useEventHandlers } from '../hooks/useEventHandlers';
import { useDimensions } from '../hooks/useDimensions';
import { usePageSpread } from '../hooks/usePageSpread';
import { usePageCreation } from '../hooks/usePageCreation';
import { useZoomControl } from '../hooks/useZoomControl';
import { BookService } from '@/services/book.service';

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
  // Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Context
  const { setCanvas, pageParams /*, setPages */ } = useContext(BookContext);

  // State
  const dimensions = useDimensions(
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
    dimensions
  );
  useZoomControl(fabricCanvasRef.current, dimensions, spreadSize);

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
        height: dimensions.height,
        width: dimensions.width,
        selection: true,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
      });
      return canvas;
    },
    [dimensions, sidePanelWidth, pagesPanelWidth]
  );
  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);
      const canvas = fabricCanvasRef.current as fabric.Canvas & {
        lastPosX?: number;
        lastPosY?: number;
      };
      console.log('#0 setCanvas !');
      setCanvas(canvas);

      return () => {
        console.log('#0 on unmount canvas');
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [initCanvas, setCanvas, dimensions, spreadPages]);

  return (
    <div ref={containerRef} className="relative flex-1">
      {/* <SpreadNavigation /> */}
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadViewerCanvas;
