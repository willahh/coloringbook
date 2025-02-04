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
import { BookPageContext } from '../page';
import { Page } from '@/domain/book';
import { useEventHandlers } from './hooks/useEventHandlers';
import { useDimensions } from './hooks/useDimensions';
import { usePageSpread } from './hooks/usePageSpread';
import { usePageCreation } from './hooks/usePageCreation';
import { useZoomControl } from './hooks/useZoomControl';

interface SpreadCanvasProps {
  width?: number;
  height?: number;
  pages: Page[];
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = ({ pages }) => {
  // Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Context
  const { setCanvas, pageParams, setPages } = useContext(BookPageContext);

  // State
  const dimensions = useDimensions(containerRef);

  // Process
  const { pageSpread } = usePageSpread(pages, pageParams);

  // Init
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
    [dimensions]
  );

  useEffect(() => {
    if (JSON.stringify(pageSpread) !== JSON.stringify(pages)) {
      setPages(pages);
    }
  }, [pageSpread, pages, setPages]);

  useEventHandlers(fabricCanvasRef.current);

  const spreadSize = usePageCreation(
    fabricCanvasRef.current,
    pageSpread,
    dimensions
  );
  useZoomControl(fabricCanvasRef.current, dimensions, spreadSize);

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);
      const canvas = fabricCanvasRef.current as fabric.Canvas & {
        lastPosX?: number;
        lastPosY?: number;
      };
      setCanvas(canvas);

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [dimensions, initCanvas, setCanvas, pageSpread, pages, setPages]);

  return (
    <div ref={containerRef} className="relative flex-1">
      {/* <SpreadNavigation /> */}
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadViewerCanvas;
