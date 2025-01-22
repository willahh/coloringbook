import React, { useRef, useEffect } from 'react';
// import { Canvas, Point } from 'fabric';
import * as fabric from 'fabric'; // Import the entire fabric library

interface SpreadCanvasProps {
  width?: number;
  height?: number;
}

const SpreadCanvas: React.FC<SpreadCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const initCanvas = (canvasElement: HTMLCanvasElement) =>
    new fabric.Canvas(canvasElement, {
      height: 800,
      width: 800,
      backgroundColor: 'pink',
      selection: false,
      renderOnAddRemove: true,
    });

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);

      fabricCanvasRef.current.on('mouse:over', () => {
        console.log('hello');
      });

      //
      const text = new fabric.FabricText('Fabric.JS', {
        // cornerStyle: 'round',
        cornerStrokeColor: 'blue',
        cornerColor: 'lightblue',
        // cornerStyle: 'circle',
        padding: 10,
        transparentCorners: false,
        cornerDashArray: [2, 2],
        borderColor: 'orange',
        borderDashArray: [3, 1, 3],
        borderScaleFactor: 2,
      });
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.centerObject(text);
      fabricCanvasRef.current.setActiveObject(text);
      //

      return () => {
        fabricCanvasRef.current?.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadCanvas;
