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

import { debounce } from 'lodash';
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import * as fabric from 'fabric';
import { CanvasContext } from '../page';
import {
  handleMouseWheel,
  handleMouseOver,
  handleMouseOut,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDocumentKeyDown,
  handleDocumentKeyUp,
} from './utils/canvasEvents';

import { createPageGroup } from './Page';
import { BookService } from '@/services/BookService';

interface SpreadCanvasProps {
  width?: number;
  height?: number;
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
  const { setCanvas, bookData, pageParams } = useContext(CanvasContext);
  const [localPages, setLocalPages] = useState(bookData.pages);
  const currentPageId = Number(pageParams.pageId) || 0;
  const pageSpread = useMemo(() => {
    return BookService.getSpreadForPage(localPages, currentPageId);
  }, [localPages, currentPageId]);

  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) => {
      const canvas = new fabric.Canvas(canvasElement, {
        height: dimensions.height,
        width: dimensions.width,
        selection: false,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
      });
      // onCanvasReady(canvas);
      return canvas;
    },
    [dimensions]
  );

  const updateDimensions = debounce(() => {
    if (containerRef.current) {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      const { clientWidth } = containerRef.current;
      setDimensions({ width: clientWidth, height: viewportHeight - 150 });
    }
  }, 200);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (JSON.stringify(pageSpread) !== JSON.stringify(bookData.pages)) {
      setLocalPages(bookData.pages);
    }
  }, [pageSpread, bookData.pages]);

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);
      const canvas = fabricCanvasRef.current;
      setCanvas(canvas);

      canvas.on('mouse:wheel', handleMouseWheel(canvas));
      canvas.on('mouse:over', handleMouseOver(canvas));
      canvas.on('mouse:out', handleMouseOut(canvas));
      canvas.on('mouse:down', handleMouseDown(canvas));
      canvas.on('mouse:move', handleMouseMove(canvas));
      canvas.on('mouse:up', handleMouseUp(canvas));

      // fixme: remove on unmount
      document.onkeydown = handleDocumentKeyDown(canvas);
      document.onkeyup = handleDocumentKeyUp(canvas);

      const createGroups = async () => {
        const pageGroups = await Promise.all(
          pageSpread.map((page, index) =>
            createPageGroup(page, index, dimensions)
          )
        );

        const spreadPages = new fabric.Group(pageGroups, {
          selectable: false,
          evented: false,
          left: 0,
          scaleX: 1,
          scaleY: 1,
          lockRotation: true,
        });

        const mask = new fabric.Rect({
          width: 400,
          height: 300,
          left: 0,
          top: 0,
          fill: 'rgba(0,0,0,0)', // Transparent
          stroke: 'black', // Optional, for debugging
          strokeWidth: 1, // Optional
        });
        canvas.add(spreadPages);
        canvas.setActiveObject(spreadPages);
        canvas.clipPath = mask;
        canvas.renderAll();
      };

      createGroups();

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [dimensions, initCanvas, setCanvas, localPages, pageSpread]);

  return (
    <div ref={containerRef} className="flex-1">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadViewerCanvas;
