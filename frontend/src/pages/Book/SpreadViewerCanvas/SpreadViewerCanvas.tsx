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

import { BookService } from '@/services/BookService';
import { Page } from '@/domain/book';
import { ObjectFactory } from './object/ObjectFactory';

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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
      return canvas;
    },
    [dimensions]
  );

  const updateDimensions = debounce(() => {
    if (containerRef.current) {
      const viewportHeight = Math.min(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      const dimensions = {
        width:
          window.innerWidth - containerRef.current.getBoundingClientRect().x,
        height: viewportHeight - 150,
      };

      setDimensions({ width: dimensions.width, height: dimensions.height });
    }
  }, 200);

  useEffect(() => {
    updateDimensions();
    setTimeout(() => {
      updateDimensions();
    }, 300); // FIXME: need another, maybe waiting the initial animations to finish
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
      const canvas = fabricCanvasRef.current as fabric.Canvas & {
        lastPosX?: number;
        lastPosY?: number;
      };
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

      // Create pages
      const canvasBorder = 8;
      const spreadSize = { width: 0, height: 0 };
      pageSpread.forEach((page, index) => {
        // const paysage = dimensions.width > dimensions.height;
        // const fitPageHeight = dimensions.width > dimensions.height;
        const fitPageHeight =
          page.aspectRatio.width > page.aspectRatio.height ||
          dimensions.width > dimensions.height;
        let pageWidth = 0;
        let pageHeight = 0;
        if (fitPageHeight) {
          pageHeight = dimensions.height - canvasBorder * 2;
          pageWidth =
            pageHeight * (page.aspectRatio.width / page.aspectRatio.height) -
            canvasBorder * 2;
        } else {
          pageWidth = dimensions.width - canvasBorder * 2;
          pageHeight =
            pageWidth * (page.aspectRatio.height / page.aspectRatio.width) -
            canvasBorder * 2;
        }
        // console.log('#2 pageWidth', pageWidth);
        // console.log('#2 pageHeight', pageHeight);
        const offsetX = index * pageWidth;
        spreadSize.width += pageWidth;
        spreadSize.height = Math.max(spreadSize.height, pageHeight);

        const rect = new fabric.Rect({
          width: pageWidth,
          height: pageHeight,
          left: offsetX,
          top: 0,
          fill: 'white',
          stroke: '#ccc',
          strokeWidth: 2,
          selectable: false,
        });
        canvas.add(rect);
        // fabricObjects.push(rect);

        // Create objects
        page.elements.forEach(async (element) => {
          const object = ObjectFactory.createObject(
            element,
            offsetX,
            pageWidth,
            pageHeight
          );
          const fabricObject = await object?.getObject();

          if (fabricObject) {
            fabricObject.set('objet', element);
            canvas.add(fabricObject);
            // fabricObjects.push(fabricObject);
          }
        });
      });

      const mask = new fabric.Rect({
        width: spreadSize.width + canvasBorder,
        height: spreadSize.height + canvasBorder,
        left: 0,
        top: 0,
      });
      canvas.clipPath = mask;

      // test
      // const url = 'http://localhost:5173/assets/SVG/MesaDeTrabajo.svg';
      // console.log('url:', url);

      // fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then(
      //   (img) => {
      //     console.log('#3 img', img);
      //     img.set({
      //       left: 10,
      //       top: 10,
      //       width: 100,
      //       height: 100,
      //       selectable: true,
      //       hasControls: true,
            
      //     });
      //     canvas.add(img);
      //     canvas.renderAll();
      //   }
      // );
      // // canvas.add(img);


      // Center spread
      // Calculate the scale to fit the spread within the canvas dimensions
      // console.log('#2 center spread');
      const scale = 0.9;
      const scaleX = scale;
      const scaleY = scale;
      const x = dimensions.width / 2 - (spreadSize.width * scaleX) / 2;
      const y = dimensions.height / 2 - (spreadSize.height * scaleY) / 2;
      // console.log('#2 dimensions: ', dimensions);
      // console.log('#2 x: ', x, 'y: ', y);
      canvas.lastPosX = x;
      canvas.lastPosY = y;
      canvas.viewportTransform = [scaleX, 0, 0, scaleY, x, y];

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
