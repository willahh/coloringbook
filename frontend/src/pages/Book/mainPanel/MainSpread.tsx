// @ts-nocheck
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import * as fabric from 'fabric'; // Import the entire fabric library
import { CanvasContext } from '../BookPage';

interface SpreadCanvasProps {
  width?: number;
  height?: number;
  // onCanvasReady: (canvas: fabric.Canvas) => fabric.Canvas;
}

const SpreadCanvas: React.FC<SpreadCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const { setCanvas, bookData } = useContext(CanvasContext);

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

      canvas.on('mouse:wheel', function (opt) {
        const delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.998 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();

        // const vpt = this.viewportTransform;
        // if (zoom < 400 / 1000) {
        //   vpt[4] = 200 - (1000 * zoom) / 2;
        //   vpt[5] = 200 - (1000 * zoom) / 2;
        // } else {
        //   if (vpt[4] >= 0) {
        //     vpt[4] = 0;
        //   } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
        //     vpt[4] = canvas.getWidth() - 1000 * zoom;
        //   }
        //   if (vpt[5] >= 0) {
        //     vpt[5] = 0;
        //   } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
        //     vpt[5] = canvas.getHeight() - 1000 * zoom;
        //   }
        // }
      });

      let objSelected = null;

      // Pan canvas with alt key
      canvas.on('mouse:over', function (opt) {
        if (opt.e.target) {
          objSelected = opt.e.target;
        }
      });
      canvas.on('mouse:out', function (opt) {
        if (opt.e.target) {
          objSelected = null;
        }
      });

      // Pan canvas with alt key
      canvas.on('mouse:down', function (opt) {
        const evt = opt.e;
        if (evt.altKey === true || evt.code === 'Space') {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });

      canvas.on('mouse:move', function (opt) {
        if (this.isDragging) {
          const e = opt.e;
          const vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });

      canvas.on('mouse:up', function () {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
        canvas.defaultCursor = 'default'; // Reset cursor to default
      });


      document.onkeydown = function (evt) {
        if (objSelected) {
          if (evt.altKey === true || evt.code === 'Space') {
            canvas.setCursor('grab');
            canvas.defaultCursor = 'grab';
          }
        }
      };
      document.onkeyup = function () {
        if (objSelected) {
          canvas.setCursor('default');
          canvas.defaultCursor = 'default';
        }
      };

      canvas.on('keydown', function (opt) {
        console.log('keydown', opt);
        const evt = opt.e;
        if (evt.altKey === true  || evt.code === 'Space') {
          canvas.defaultCursor = 'grab';
        }
      });

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

export default SpreadCanvas;
