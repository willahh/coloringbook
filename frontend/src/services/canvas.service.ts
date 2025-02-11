import * as fabric from 'fabric';

class CanvasService {
  applyViewportTransform = (
    canvas: fabric.Canvas & { lastPosX?: number; lastPosY?: number },
    x: number,
    y: number,
    scaleX: number,
    scaleY: number
  ): void => {
    canvas.lastPosX = x;
    canvas.lastPosY = y;
    canvas.viewportTransform = [scaleX, 0, 0, scaleY, x, y];
  };

  /**
   *
   * Calcule la position et l'échelle pour centrer et ajuster une planche sur le canvas.
   * @param canvasSize - Dimensions du canvas
   * @param spreadSize - Dimensions de la planche à centrer
   * @returns Un objet contenant la position x, y et les échelles x et y.
   */
  calculateCenteredSpread(
    canvasSize: { width: number; height: number },
    spreadSize: { width: number; height: number }
  ) {
    const scale = 0.8; // This needs to be calculated
    const offsetX = -32; // Tabs width on the left
    const scaleX = scale;
    const scaleY = scale;
    const x =
      (canvasSize.width + offsetX) / 2 - (spreadSize.width * scaleX) / 2;
    const headerHeight = 64;
    const y =
      canvasSize.height / 2 -
      (spreadSize.height * scaleY) / 2 -
      headerHeight / 2;

    return { x, y, scaleX, scaleY };
  }
}

const canvasService = new CanvasService();
export default canvasService;
