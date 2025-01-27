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
import { Tooltip } from '@components/Tooltip';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import * as fabric from 'fabric';
import { BookPageContext } from '../page';
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
import { Page } from '@/domain/book';
// import { PageService } from '@/services/PageService';

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
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });

  // Process
  const currentPageId = Number(pageParams.pageId) || 0;
  const pageSpread = useMemo(() => {
    return BookService.getSpreadForPage(pages, currentPageId);
  }, [pages, currentPageId]);

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
      // onCanvasReady(canvas);
      return canvas;
    },
    [dimensions]
  );

  // const updatePageThumbs = useCallback(
  //   (fabricCanvas: fabric.Canvas) => {
  //     if (fabricCanvas) {
  //       PageService.updateThumbImageData(pages, fabricCanvas, 1, setPages);
  //     }
  //   },
  //   []
  // );

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
    if (JSON.stringify(pageSpread) !== JSON.stringify(pages)) {
      setPages(pages);
    }
  }, [pageSpread, pages, setPages]);

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
      canvas.on('selection:created', function (e) {
        console.log('Selected:', e.selected);
      });
      canvas.on('selection:updated', function (e) {
        console.log('Selection Updated:', e.selected);
      });
      canvas.on('selection:cleared', function (e) {
        console.log('Selection Cleared', e);
      });

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

        console.log(
          '#1 spreadPages.getScaledWidth()',
          spreadPages.getScaledWidth()
        );
        console.log(
          '#1 spreadPages.getScaledHeight()',
          spreadPages.getScaledHeight()
        );

        // TODO: Center the spread in viewport
        // Spread dimensions in pixel
        // const spreadDimensions = { width: 1280, height: 1024 };
        canvas.zoomToPoint(new fabric.Point(100, 100), 0.5);

        // FIXME: Spread mask
        // const mask = new fabric.Rect({
        //   width: dimensions.width,
        //   height: dimensions.height,
        //   left: 0,
        //   top: 0,
        //   fill: 'rgba(0,0,0,0)', // Transparent
        //   stroke: 'black', // Optional, for debugging
        //   strokeWidth: 1, // Optional
        // });
        canvas.add(spreadPages);
        canvas.setActiveObject(spreadPages);
        // canvas.clipPath = mask;
        canvas.renderAll();
      };

      createGroups();

      // TODO:
      // - [ ] Create a new button updateCoverImageBackground
      // - [ ] Expand the update of the page preview for all pages
      // - [ ] Find a way to update all thumb covers without crash
      // updatePageThumbs(canvas);

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [dimensions, initCanvas, setCanvas, pageSpread, pages, setPages]);

  // TODO: mutation
  setTimeout(() => {
    console.log('## timeout');

    if (fabricCanvasRef.current) {
      // PageService.updateThumbImageData(
      //   pages,
      //   fabricCanvasRef.current,
      //   1,
      //   setPages
      // );
    }
  }, 1000);

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="absolute left-0 flex items-center justify-between h-full p-8 ">
        <Tooltip content="Page précédente">
          <button
            className={`w-12 h-12 rounded-full z-10 p-2 
          text-primary-200
           transition-all duration-400
         hover:bg-primary-950 hover:ring-1 hover:ring-primary-800 
         active:ring-primary-50
          `}
          >
            <ArrowLeftIcon />
          </button>
        </Tooltip>
      </div>
      <div className="absolute right-0 flex items-center justify-between h-full p-8 ">
        <Tooltip content="Page suivante">
          <button
            className={`w-12 h-12 rounded-full z-10 p-2 
          text-primary-200
           transition-all duration-400
         hover:bg-primary-950 hover:ring-1 hover:ring-primary-800 
         active:ring-primary-50
          `}
          >
            <ArrowRightIcon />
          </button>
        </Tooltip>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadViewerCanvas;
