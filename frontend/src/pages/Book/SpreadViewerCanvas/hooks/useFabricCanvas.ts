import { useRef, useEffect, useCallback } from 'react';
import * as fabric from 'fabric';

interface Dimensions {
  height: number;
  width: number;
}

interface UseFabricCanvasReturn {
  canvasRef: React.RefObject<fabric.Canvas | null>;
  canvasElementRef: React.RefObject<HTMLCanvasElement | null>;
}

const useFabricCanvas = (dimensions: Dimensions): UseFabricCanvasReturn => {
  const canvasRef = useRef<fabric.Canvas>(null);
  const canvasElementRef = useRef<HTMLCanvasElement>(null);

  const initCanvas = useCallback((): fabric.Canvas | null => {
    console.log('initCanvas');
    if (canvasElementRef.current) {
      const canvas = new fabric.Canvas(canvasElementRef.current, {
        height: dimensions.height,
        width: dimensions.width,
        selection: false,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
      });
      console.log('=> canvas', canvas);
      // canvasRef.current = canvas;
      return canvas;
    }
    return null;
  }, [dimensions]);

  useEffect(() => {
    const canvas = initCanvas();
    return () => {
      if (canvas) {
        console.warn('disposing canvas in useEffect');
        canvas.dispose();
      }
    };
  }, [initCanvas]);

  return { canvasRef, canvasElementRef };
};

export default useFabricCanvas;
