import { debounce } from 'lodash';
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import * as fabric from 'fabric';
import { CanvasContext } from '../BookPage';

import {
  handleMouseWheel,
  handleMouseOver,
  handleMouseOut,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
} from './utils/canvasEvents';
import {
  // isImageElement,
  isShapeElement,
  isTextElement,
  Page,
  Element as PageElement,
} from '@/domain/book';

interface SpreadCanvasProps {
  width?: number;
  height?: number;
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
  const { setCanvas, bookData } = useContext(CanvasContext);
  const [localPages, setLocalPages] = useState(bookData.pages);

  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) => {
      const canvas = new fabric.Canvas(canvasElement, {
        height: dimensions.height,
        width: dimensions.width,
        // backgroundColor: 'pink',
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
    if (JSON.stringify(localPages) !== JSON.stringify(bookData.pages)) {
      setLocalPages(bookData.pages);
    }
  }, [localPages, bookData.pages]);

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

      // document.onkeydown = handleDocumentKeyDown(canvas);
      // document.onkeyup = handleDocumentKeyUp(canvas);

      const pageGroups = localPages.map((page, index) =>
        createPageGroup(page, index, dimensions)
      );

      const allPagesGroup = new fabric.Group(pageGroups, {
        selectable: false,
        evented: false,
        left: 10,
        scaleX: 0.5,
        scaleY: 0.5,
        lockRotation: true,
      });

      console.log('pageGroups', pageGroups);
      console.log('allPagesGroup', allPagesGroup);

      canvas.add(allPagesGroup);
      canvas.setActiveObject(allPagesGroup);
      canvas.renderAll();
      console.log(
        'canvas',
        canvas.getWidth(),
        canvas.getHeight(),
        canvas.getZoom(),
        canvas.getActiveObjects()
      );

      return () => {
        console.warn('disposing canvas in SpreadViewerCanvas');
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [dimensions, initCanvas, setCanvas, localPages]);

  return (
    <div ref={containerRef} className="flex-1">
      <canvas ref={canvasRef} />
    </div>
  );
};

// Helper function for creating page groups
const createPageGroup = (
  page: Page,
  index: number,
  dimensions: { width: number; height: number }
) => {
  const aspectRatio = page.AspectRatio.h / page.AspectRatio.w;
  const pageWidth = dimensions.width / 2 - 10;
  const pageHeight = pageWidth / aspectRatio;
  const offsetX = index * pageWidth;

  const pageBackground = new fabric.Rect({
    width: pageWidth,
    height: pageHeight,
    left: 0,
    top: 0,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    selectable: false,
    evented: false,
  });

  const elements = page.elements
    .map((element: PageElement) =>
      createElement(element, pageWidth, pageHeight)
    )
    .filter((el): el is fabric.Object => el !== null);

  return new fabric.Group([pageBackground, ...elements], {
    left: offsetX,
    top: 0,
    selectable: false,
    evented: false,
  });
};

// Helper function for creating individual elements
const createElement = (
  element: PageElement,
  pageWidth: number,
  pageHeight: number
) => {
  const relativeX = (element.x / 100) * pageWidth;
  const relativeY = (element.y / 100) * pageHeight;
  const relativeW = (element.w / 100) * pageWidth;
  const relativeH = (element.h / 100) * pageHeight;

  switch (element.type) {
    case 'rectangle':
      if (isShapeElement(element.attr)) {
        return new fabric.Rect({
          left: relativeX,
          top: relativeY,
          width: relativeW,
          height: relativeH,
          fill: element.attr.fill,
          stroke: element.attr.stroke,
          strokeWidth: element.attr.strokeWidth,
        });
      }
      break;

    case 'circle':
      if (isShapeElement(element.attr)) {
        return new fabric.Circle({
          left: relativeX,
          top: relativeY,
          radius: relativeW / 2,
          fill: element.attr.fill,
          stroke: element.attr.stroke,
          strokeWidth: element.attr.strokeWidth,
        });
      }
      break;

    case 'triangle':
      if (isShapeElement(element.attr)) {
        return new fabric.Triangle({
          left: relativeX,
          top: relativeY,
          width: relativeW,
          height: relativeH,
          fill: element.attr.fill,
          stroke: element.attr.stroke,
          strokeWidth: element.attr.strokeWidth,
        });
      }
      break;

    case 'text':
      if (isTextElement(element.attr)) {
        return new fabric.Text(element.attr.text.text, {
          left: relativeX,
          top: relativeY,
          fontSize: element.attr.text.fontSize,
          textAlign: element.attr.text.textAlign,
          fill: element.attr.text.color,
        });
      }
      break;

      // case 'image':
      //   if (isImageElement(element.attr) && canvasRef.current) {
      //     fabric.Image.fromURL(element.attr.imageData, (img) => {
      //       img.set({
      //         left: relativeX,
      //         top: relativeY,
      //         width: relativeW,
      //         height: relativeH,
      //       });
      //       canvasRef.current?.add(img);
      //     });
      //   }
      //   break;

      return null; // Return null as the image is added asynchronously
    default:
      return null;
  }
};

export default SpreadViewerCanvas;
