import * as fabric from 'fabric';
import { useEffect } from 'react';

export const useZoomControl = (
  canvas: fabric.Canvas | null,
  dimensions: { width: number; height: number },
  spreadSize: { width: number; height: number }
) => {
  useEffect(() => {
    if (canvas) {
      const scale = 0.8; // This needs to be calculated
      const offsetX = 100; // Tabs width on the left
      const scaleX = scale;
      const scaleY = scale;
      const x = ((dimensions.width + offsetX) / 2 - (spreadSize.width * scaleX) / 2)
      const y = dimensions.height / 2 - (spreadSize.height * scaleY) / 2;

      canvas.lastPosX = x;
      canvas.lastPosY = y;
      canvas.viewportTransform = [scaleX, 0, 0, scaleY, x, y];
    }
  }, [canvas, dimensions, spreadSize]);
};
