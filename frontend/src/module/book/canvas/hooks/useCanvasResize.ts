import { useEffect } from 'react';
import * as fabric from 'fabric';

export function useCanvasResize(
  canvas: fabric.Canvas | null,
  canvasSize: { width: number; height: number }
) {
    
  /**
   * [Canvas.onWindowResize]
   */
  useEffect(() => {
    console.log('#c RESIZE CANVAS');
    canvas?.setDimensions({
      width: canvasSize.width,
      height: canvasSize.height,
    });
  }, [canvasSize]);
}
