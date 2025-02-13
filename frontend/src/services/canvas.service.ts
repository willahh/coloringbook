import { ElementFactory } from '@/module/book/element/ElementFactory';
import * as fabric from 'fabric';
import { Element } from '@/common/types/book';

class CanvasService {
  private _canvas: fabric.Canvas | null = null;

  public get canvas(): fabric.Canvas | null {
    return this._canvas;
  }

  public set canvas(canvasInstance: fabric.Canvas | null) {
    this._canvas = canvasInstance;
  }

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

  async addElementToCanvas(
    element: Element,
    offsetX: number,
    pageWidth: number,
    pageHeight: number
  ) {
    const drawableElement = ElementFactory.createElement(
      element,
      offsetX,
      pageWidth,
      pageHeight
    );
    const fabricObject = await drawableElement.getObject();
    if (fabricObject && this.canvas) {
      fabricObject.set('objet', element);
      this.canvas.add(fabricObject);
    }
  }
}

const canvasService = new CanvasService();
export default canvasService;
