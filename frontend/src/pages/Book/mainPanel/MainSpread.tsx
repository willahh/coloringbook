// @ts-nocheck
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import * as fabric from 'fabric'; // Import the entire fabric library
import { BookPageContext } from '../page';

interface SpreadCanvasProps {
  width?: number;
  height?: number;
  // onCanvasReady: (canvas: fabric.Canvas) => fabric.Canvas;
}

const InteractiveBookCanvas: React.FC<SpreadCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const { setCanvas, bookData } = useContext(BookPageContext);

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

  const updateDimensions = () => {
    if (containerRef.current) {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      const { clientWidth } = containerRef.current;
      const height = viewportHeight - 150;
      setDimensions({ width: clientWidth, height: height });
    }
  };

  const handleMouseWheel = (canvas) => (opt) => {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.998 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };

  const handleMouseOver = (canvas) => (opt) => {
    if (opt.e.target) {
      canvas.objSelected = opt.e.target;
    }
  };

  const handleMouseOut = (canvas) => (opt) => {
    if (opt.e.target) {
      canvas.objSelected = null;
    }
  };

  const handleMouseDown = (canvas) => (opt) => {
    const evt = opt.e;
    if (evt.altKey === true || evt.code === 'Space') {
      canvas.isDragging = true;
      canvas.selection = false;
      canvas.lastPosX = evt.clientX;
      canvas.lastPosY = evt.clientY;
    }
  };

  const handleMouseMove = (canvas) => (opt) => {
    if (canvas.isDragging) {
      const e = opt.e;
      const vpt = canvas.viewportTransform;
      vpt[4] += e.clientX - canvas.lastPosX;
      vpt[5] += e.clientY - canvas.lastPosY;
      canvas.requestRenderAll();
      canvas.lastPosX = e.clientX;
      canvas.lastPosY = e.clientY;
    }
  };

  const handleMouseUp = (canvas) => () => {
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.isDragging = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';
  };

  const handleDocumentKeyDown = (canvas) => (evt) => {
    if (canvas.objSelected) {
      if (evt.altKey === true || evt.code === 'Space') {
        canvas.setCursor('grab');
        canvas.defaultCursor = 'grab';
      }
    }
  };

  const handleDocumentKeyUp = (canvas) => () => {
    if (canvas.objSelected) {
      canvas.setCursor('default');
      canvas.defaultCursor = 'default';
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);

      const canvas = fabricCanvasRef.current; // Alias to make it like most examples on the web!
      setCanvas(canvas);

      canvas.on('mouse:wheel', handleMouseWheel(canvas));
      canvas.on('mouse:over', handleMouseOver(canvas));
      canvas.on('mouse:out', handleMouseOut(canvas));
      canvas.on('mouse:down', handleMouseDown(canvas));
      canvas.on('mouse:move', handleMouseMove(canvas));
      canvas.on('mouse:up', handleMouseUp(canvas));

      document.onkeydown = handleDocumentKeyDown(canvas);
      document.onkeyup = handleDocumentKeyUp(canvas);

      let objSelected = null;

      // Add elements from bookData to the canvas
      const pageGroups = bookData.pages.map((page, index) => {
        const aspectRatio = page.AspectRatio.h / page.AspectRatio.h;
        const pageWidth = dimensions.width / 2 - 10;
        const pageHeight = pageWidth / aspectRatio;

        // Add two white rectangles with borders to represent two pages
        const offsetX = index * pageWidth;
        const pageElement = new fabric.Rect({
          width: pageWidth,
          height: pageHeight,
          left: 0,
          top: 0,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 2,
          selectable: false, // Make non-selectable
          evented: false, // Make non-editable
        });

        const elements = page.elements
          .map((element) => {
            let fabricElement;
            const relativeX = (element.x / 100) * pageWidth;
            const relativeY = (element.y / 100) * pageHeight;
            const relativeW = (element.w / 100) * pageWidth;
            const relativeH = (element.h / 100) * pageHeight;

            switch (element.type) {
              case 'rectangle':
                fabricElement = new fabric.Rect({
                  left: relativeX,
                  top: relativeY,
                  width: relativeW,
                  height: relativeH,
                  fill: element.attr.fill,
                  stroke: element.attr.stroke,
                  strokeWidth: element.attr.strokeWidth,
                  // selectable: true
                });
                break;
              case 'circle':
                fabricElement = new fabric.Circle({
                  left: relativeX,
                  top: relativeY,
                  radius: relativeW / 2,
                  fill: element.attr.fill,
                  stroke: element.attr.stroke,
                  strokeWidth: element.attr.strokeWidth,
                });
                break;
              case 'triangle':
                fabricElement = new fabric.Triangle({
                  left: relativeX,
                  top: relativeY,
                  width: relativeW,
                  height: relativeH,
                  fill: element.attr.fill,
                  stroke: element.attr.stroke,
                  strokeWidth: element.attr.strokeWidth,
                });
                break;
              case 'text':
                fabricElement = new fabric.Text(element.attr.text.text, {
                  left: relativeX,
                  top: relativeY,
                  fontSize: element.attr.text.fontSize,
                  textAlign: element.attr.text.textAlign,
                  fill: element.attr.text.color,
                });
                break;
              case 'image':
                fabric.Image.fromURL(element.attr.imageData, (img) => {
                  img.set({
                    left: relativeX,
                    top: relativeY,
                    width: relativeW,
                    height: relativeH,
                  });
                  canvas.add(img);
                });
                break;
              default:
                break;
            }
            return fabricElement;
          })
          .filter(Boolean);

        return new fabric.Group([pageElement, ...elements], {
          left: 0 + offsetX,
          top: 0,
          selectable: false,
          evented: false,
        });
      });

      const allPagesGroup = new fabric.Group(pageGroups, {
        selectable: false,
        evented: false,
        left: 10,
        scaleX: 0.5,
        scaleY: 0.5,
        lockRotation: true,
      });

      canvas.add(allPagesGroup);
      canvas.setActiveObject(allPagesGroup);
      canvas.renderAll();

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [dimensions, initCanvas, setCanvas]);

  // useEffect(() => {
  //   const handleWheel = (event) => {
  //     console.log('handleWheel');
  //     if (event.ctrlKey) {
  //       event.preventDefault();
  //       const delta = event.deltaY;
  //       const zoomFactor = 1.1;
  //       const canvas = fabricCanvasRef.current;

  //       if (canvas) {
  //         let zoom = canvas.getZoom();
  //         zoom *= delta > 0 ? 1 / zoomFactor : zoomFactor;
  //         canvas.zoomToPoint({ x: event.offsetX, y: event.offsetY }, zoom);
  //       }
  //     }
  //   };

  //   const canvasElement = canvasRef.current;
  //   console.log('canvasElement', canvasElement);
  //   console.log('canvasElement.nextElementSibling', canvasElement.nextElementSibling)
  //   if (canvasElement) {
  //     const upperCanvas = canvasElement.nextElementSibling; // Assuming upper-canvas is the next sibling
  //     if (upperCanvas) {
  //       upperCanvas.addEventListener('wheel', handleWheel);
  //     }
  //   }

  //   return () => {
  //     if (canvasElement && canvasElement.nextElementSibling) {
  //       canvasElement.nextElementSibling.removeEventListener('wheel', handleWheel);
  //     }
  //   };
  // }, []);

  return (
    <div ref={containerRef} className="flex-1">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default InteractiveBookCanvas;
