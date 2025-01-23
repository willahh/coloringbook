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
  const { setCanvas } = useContext(CanvasContext);

  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) => {
      const canvas = new fabric.Canvas(canvasElement, {
        height: dimensions.height,
        width: dimensions.width,
        // backgroundColor: 'pink',
        selection: false,
        renderOnAddRemove: true,
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
      console.log('#1 viewportHeight', viewportHeight);
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
      console.log('#1 setCanvas ', canvas)
      setCanvas(canvas);

      canvas.on('mouse:over', () => {
        console.log('hello');
      });

      // Add two white rectangles with borders to represent two pages
      const page1 = new fabric.Rect({
        width: 210,
        height: 297,
        left: dimensions.width / 4 - 5,
        top: dimensions.height / 4,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        selectable: false, // Make non-selectable
        evented: false, // Make non-editable
      });

      const page2 = new fabric.Rect({
        width: 210,
        height: 297,
        left: page1.getX() + page1.width,
        top: page1.getY(),
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        selectable: false, // Make non-selectable
        evented: false, // Make non-editable
      });
      canvas.add(page1, page2);

      const text = new fabric.Text('Fabric.JS', {
        cornerStrokeColor: 'blue',
        cornerColor: 'lightblue',
        padding: 10,
        transparentCorners: false,
        cornerDashArray: [2, 2],
        borderColor: 'orange',
        borderDashArray: [3, 1, 3],
        borderScaleFactor: 2,
      });
      canvas.add(text);
      canvas.centerObject(text);
      canvas.setActiveObject(text);

      // Example: Get image data
      const imgData = canvas.toDataURL();
      console.log('imgData', imgData);

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [dimensions, initCanvas, setCanvas]);

  return (
    <div ref={containerRef} className="flex-1">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadCanvas;

