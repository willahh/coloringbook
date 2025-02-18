import { ElementFactory } from '@/module/book/element/ElementFactory';
import * as fabric from 'fabric';
import { Element, Page } from '@/common/types/book';
import {
  FabricRectPage,
  PageFabricObject,
  PageDimensions,
} from '@/common/interfaces';

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

  private registerEventListeners() {}

  drawPagesElementsAndMask(
    canvas: fabric.Canvas,
    spreadPages: Page[],
    dimensions: { width: number; height: number }
  ) {
    if (canvas) {
      let activeFabricObject: fabric.FabricObject | null = null;
      if (canvas && canvas.getWidth() > 20) {
        console.info('#001 CANVAS DRAW PAGES AND OBJECTS');
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

          const scaleY = pageHeight / canvas.height;
          console.log('scaleY', scaleY);

          const offsetX = 0;
          // const offsetX = (index * (pageWidth + 100));
          const offsetY = index * (pageHeight + 100);
          // newSpreadSize.width += pageWidth;
          // newSpreadSize.height = Math.max(newSpreadSize.height, pageHeight);

          newSpreadSize.height += pageHeight;
          newSpreadSize.width = Math.max(newSpreadSize.width, pageWidth);

          const pageRect = new fabric.Rect({
            isPage: true,
            pageId: page.pageId,
            width: pageWidth,
            height: pageHeight,
            left: offsetX,
            top: offsetY,
            fill: 'white',

            hasControls: false,
            borderScaleFactor: 2,
            selectable: true,
            borderColor: 'red',
            lockMovementX: true,
            lockMovementY: true,

            shadow: new fabric.Shadow({
              color: 'rgba(0, 0, 0, .4)',
              nonScaling: true,
              blur: 8,
              offsetX: 2,
              offsetY: 2,
            }),
          });
          canvas.add(pageRect);

          const pageInfo = new fabric.Text(
            `Page ${page.pageNumber} / ${spreadPages.length}`,
            {
              left: offsetX,
              top: offsetY + pageHeight + 8,
              fontSize: 16,
              fill: 'white',
              fontFamily: 'Arial',
            }
          );
          canvas.add(pageInfo);

          // TODO, gérer la sauvegarde de la sélection ICI

          // Create page elements

          page.elements.forEach(async (element) => {
            const fabricObject = await canvasService.addElementToCanvas(
              page.pageId,
              element,
              offsetX,
              offsetY,
              pageWidth,
              pageHeight
            );
            console.log('#02 fabricObject', fabricObject);
            if (fabricObject) {
              activeFabricObject = fabricObject;
              console.log('#02 set activeFabricObject', activeFabricObject);
            }
          });

          console.log('#02 => activeFabricObject', activeFabricObject);

          // canvas.getObjects()

          // await selectedActiveObject
          // console.log('#02 selectedActiveObject', selectedActiveObject);

          if (activeFabricObject) {
            canvas.setActiveObject(activeFabricObject);
            // debugger;
          }
        });

        // Create mask
        // const mask = new fabric.Rect({
        //   width: newSpreadSize.width + canvasBorder,
        //   height: newSpreadSize.height + canvasBorder,
        //   left: -(canvasBorder / 2),
        //   top: -(canvasBorder / 2),
        // });
        // canvas.clipPath = mask;
        return newSpreadSize;
      }
    }
  }

  getPageDimensions(canvas: fabric.Canvas, pageId: number): PageDimensions {
    let pageDimensions = {
      width: 0,
      height: 0,
    };
    const pageRect = canvas.getObjects().find((obj) => {
      if (
        obj.type === 'rect' &&
        (obj as FabricRectPage).pageId === Number(pageId)
      ) {
        return true;
      }
      return false;
    });

    if (pageRect) {
      pageDimensions = {
        width: pageRect.width,
        height: pageRect.height,
      };
    }

    return pageDimensions;
  }

  findPagesInCanvas(canvas: fabric.Canvas): PageFabricObject[] {
    const pages = canvas.getObjects().filter((obj) => {
      return (obj as fabric.Object & { isPage?: boolean }).isPage === true;
    }) as PageFabricObject[];

    return pages;
  }

  getMaxPageWidth(canvas: fabric.Canvas): number {
    const pages = canvasService.findPagesInCanvas(canvas);
    const zoom = canvas.getZoom();
    if (pages.length === 0) return 0; // Si aucune page, largeur totale est 0

    // Calculer la largeur max parmi toutes les pages
    return Math.max(
      ...pages.map((page) => {
        return page.width * zoom || 0;
      })
    );
  }

  focusOnPage(
    canvas: fabric.Canvas,
    pageId: number,
    margin = 100
  ): fabric.TMat2D | null {
    const page = canvas
      .getObjects()
      .find(
        (obj) => (obj as PageFabricObject).pageId === pageId
      ) as PageFabricObject & fabric.Rect;

    if (!page) {
      console.warn(`Page with ID ${pageId} not found.`);
      return null;
    }

    // Cast en fabric.Rect pour les propriétés spécifiques à Rect
    const pageRect = page as fabric.Rect;
    const pageLeft = pageRect.left || 0;
    const pageTop = pageRect.top || 0;
    const pageWidth = pageRect.width || 0;
    const pageHeight = pageRect.height || 0;

    // Dimensions du canvas
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // Calculer le zoom nécessaire pour voir toute la page avec des marges
    const zoomX = (canvasWidth - 2 * margin) / pageWidth;
    const zoomY = (canvasHeight - 2 * margin) / pageHeight;
    const zoom = Math.min(zoomX, zoomY);

    // Calculer le centre de la page et du canvas pour positionner correctement le viewport
    const centerPageX = pageLeft + pageWidth / 2;
    const centerPageY = pageTop + pageHeight / 2;
    const centerCanvasX = canvasWidth / 2;
    const centerCanvasY = canvasHeight / 2;

    // Calculer le déplacement nécessaire pour centrer la page dans le canvas
    const deltaX = centerCanvasX - centerPageX * zoom;
    const deltaY = centerCanvasY - centerPageY * zoom;

    // Construire et retourner le viewport transform
    return [zoom, 0, 0, zoom, deltaX, deltaY];
  }

  constrainHorizontalMovement(
    canvasWidth: number,
    totalWidth: number,
    x: number
  ): number {
    let newX = x;

    // Limite de déplacement horizontal
    const margin = 100;
    const maxX = margin; // Si le contenu est aligné à gauche par défaut
    const minX = canvasWidth - totalWidth - margin; // Si le contenu dépasse la taille du canvas

    // Centrer le contenu si possible
    if (totalWidth <= canvasWidth) {
      console.log('#z center');
      newX = (canvasWidth - totalWidth) / 2; // Centrer
    } else {
      newX = Math.min(Math.max(x, minX), maxX);
    }
    return newX;
  }

  async addElementToCanvas(
    pageId: number,
    element: Element,
    offsetX: number,
    offsetY: number,
    pageWidth: number,
    pageHeight: number
  ): Promise<fabric.FabricObject> {
    const drawableElement = ElementFactory.createElement(
      element,
      offsetX,
      offsetY,
      pageWidth,
      pageHeight
    );
    const fabricObject = await drawableElement.getObject();
    if (fabricObject && this.canvas) {
      fabricObject.set('objet', element);
      fabricObject.set('pageId', pageId);
      this.canvas.add(fabricObject);
    }
    return fabricObject;
  }
}

const canvasService = new CanvasService();
export default canvasService;
