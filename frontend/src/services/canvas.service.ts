import { ElementFactory } from '@/module/book/element/ElementFactory';
import * as fabric from 'fabric';
import { Element, Page } from '@/common/types/book';
// import { useDispatch } from '@/common/store';
// import { updateElementByElementId } from '@/module/book/element/Element.action';

class CanvasService {
  private _canvas: fabric.Canvas | null = null;

  public get canvas(): fabric.Canvas | null {
    return this._canvas;
  }

  public set canvas(canvasInstance: fabric.Canvas | null) {
    this._canvas = canvasInstance;
    if (this._canvas) {
      this.registerEventListeners();
    }
  }

  private registerEventListeners() {
    // TODO: Implémenter un dispatch Redux
    // const dispatch = useDispatch(); // FIXME !!!!!
    // if (!this._canvas) return;
    // this._canvas.on('object:modified', (event) => {
    //   const target = event.target;
    //   if (target && target.get('objet')) {
    //     const element = target.get('objet');
    //     // dispatch(
    //     //   updateElementByElementId({
    //     //     elementId: element.id,
    //     //     pageId: pageId,
    //     //     x: target.left ?? element.x,
    //     //     y: target.top ?? element.y,
    //     //     w: (target.scaleX ?? 1) * (element.w || target.width),
    //     //     h: (target.scaleY ?? 1) * (element.h || target.height),
    //     //   })
    //     // );
    //   }
    // });
  }

  drawPagesElementsAndMask(
    canvas: fabric.Canvas,
    spreadPages: Page[],
    dimensions: { width: number; height: number }
  ) {
    if (canvas) {
      if (canvas && canvas.getWidth() > 400) {
        console.info('#001 CANVAS UPDATE PAGES AND OBJECTS');
        const canvasBorder = 16;
        const newSpreadSize = { width: 0, height: 0 };

        spreadPages.forEach((page, index) => {
          const fitPageHeight =
            page.aspectRatio.width > page.aspectRatio.height ||
            dimensions.width > dimensions.height;
          let pageWidth = 0;
          let pageHeight = 0;

          if (fitPageHeight) {
            pageHeight = dimensions.height - canvasBorder * 2;
            pageWidth =
              pageHeight * (page.aspectRatio.width / page.aspectRatio.height) -
              canvasBorder * 2;
          } else {
            pageWidth = dimensions.width - canvasBorder * 2;
            pageHeight =
              pageWidth * (page.aspectRatio.height / page.aspectRatio.width) -
              canvasBorder * 2;
          }

          const offsetX = index * pageWidth;
          newSpreadSize.width += pageWidth;
          newSpreadSize.height = Math.max(newSpreadSize.height, pageHeight);

          const rect = new fabric.Rect({
            width: pageWidth,
            height: pageHeight,
            left: offsetX,
            top: 0,
            fill: 'white',
            selectable: false,
            shadow: new fabric.Shadow({
              color: 'rgba(0, 0, 0, .4)',
              nonScaling: true,
              blur: 8,
              offsetX: 2,
              offsetY: 2,
            }),
          });
          canvas.add(rect);

          // Create page elements
          page.elements.forEach(async (element) => {
            canvasService.addElementToCanvas(
              element,
              offsetX,
              pageWidth,
              pageHeight
            );
          });
        });

        // Create mask
        const mask = new fabric.Rect({
          width: newSpreadSize.width + canvasBorder,
          height: newSpreadSize.height + canvasBorder,
          left: -(canvasBorder / 2),
          top: -(canvasBorder / 2),
        });
        canvas.clipPath = mask;
        return newSpreadSize;
      }
    }
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
