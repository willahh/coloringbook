import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

export const useCanvas = ({
  width,
  height,
  setCanvas,
}: {
  width: number;
  height: number;
  setCanvas: (canvas: fabric.Canvas) => void;
}) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setDimensions({ width, height });
      canvasRef.current.clear();
      setCanvas(canvasRef.current);
    }
  }, [width, height, setCanvas]);

  return { canvasRef, canvas: canvasRef.current };
};
