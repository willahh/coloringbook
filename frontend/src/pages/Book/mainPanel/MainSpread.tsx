import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric'; // Import the entire fabric library
import jsPDF from 'jspdf';

interface SpreadCanvasProps {
  width?: number;
  height?: number;
}

const SpreadCanvas: React.FC<SpreadCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) =>
      new fabric.Canvas(canvasElement, {
        height: dimensions.height,
        width: dimensions.width,
        // backgroundColor: 'pink',
        selection: false,
        renderOnAddRemove: true,
      }),
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

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [dimensions, initCanvas]);

  const exportToPDF = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const pdf = new jsPDF('p', 'px', [dimensions.width, dimensions.height]);
      const imgData = canvas.toDataURL({
        format: 'png',
        multiplier: 0,
      });

      // Les dimensions du PDF doivent correspondre à celles du canvas
      pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height);
      pdf.save('canvas.pdf');
    }
  };

  return (
    <div ref={containerRef} className="flex-1">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadCanvas;
