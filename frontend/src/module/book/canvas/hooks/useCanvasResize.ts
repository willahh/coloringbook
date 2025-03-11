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
    console.log(
      `#c RESIZE CANVAS with : width: ${canvasSize.width}, height: ${canvasSize.height}`
    );
    if (canvas) {
      try {
        canvas.setDimensions({
          width: canvasSize.width,
          height: canvasSize.height,
        });
      } catch (error) {
        console.info('erreur : ', error);
      }
    }
  }, [canvasSize]);
}
