import { ElementFactory } from '@/module/book/element/ElementFactory';
import * as fabric from 'fabric';
import { Element, Page } from '@/common/types/book';
import {
  fabricRectPage,
  IPageFabricObject,
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
        (obj as fabricRectPage).pageId === Number(pageId)
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

  findPagesInCanvas(canvas: fabric.Canvas): IPageFabricObject[] {
    const pages = canvas.getObjects().filter((obj) => {
      return (obj as fabric.Object & { isPage?: boolean }).isPage === true;
    }) as IPageFabricObject[];

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

  /**
   * Calcule la position et l'échelle pour centrer et ajuster une planche sur le canvas verticalement, en se focalisant sur une page spécifique.
   * @param canvasSize - Dimensions du canvas
   * @param spreadSize - Dimensions totales de la planche à centrer (la somme des hauteurs de toutes les pages)
   * @param pages - Liste des pages
   * @param pageId - Identifiant de la page à centrer
   * @returns Un objet contenant la position x, y et les échelles x et y.
   */
  calculateCenteredSpread(
    canvasSize: { width: number; height: number },
    spreadSize: { width: number; height: number },
    pages: Page[],
    pageId: number
  ) {
    console.log('calculateCenteredSpread');
    // Vérification que pages est bien défini et est un array
    if (!Array.isArray(pages)) {
      console.error('Pages must be an array');
      return { x: 0, y: 0, scaleX: 1, scaleY: 1 }; // Retourner des valeurs par défaut en cas d'erreur
    }

    // Calculer l'échelle pour s'assurer que la page cible rentre dans le canvas
    const scale = Math.min(1, canvasSize.height / spreadSize.height);
    const offsetX = -32; // Tabs width on the left
    const scaleX = scale;
    const scaleY = scale;

    // Trouver l'index de la page cible
    const targetPageIndex = pages.findIndex((page) => page.pageId === pageId);
    if (targetPageIndex === -1) {
      console.error(`Page with id ${pageId} not found`);
      return { x: 0, y: 0, scaleX: 1, scaleY: 1 }; // Retourner des valeurs par défaut si la page n'est pas trouvée
    }

    // Calculer la position x (centrage horizontal de la page cible)
    const targetPageWidth =
      pages[targetPageIndex].aspectRatio.width *
      (pages[targetPageIndex].aspectRatio.height /
        pages[targetPageIndex].aspectRatio.width) *
      scaleY;
    const x = (canvasSize.width + offsetX) / 2 - (targetPageWidth * scaleX) / 2;

    // Calculer la position y pour centrer la page cible verticalement
    let yOffset = 0;
    for (let i = 0; i < targetPageIndex; i++) {
      // Ajouter la hauteur des pages précédentes avec une marge
      yOffset += pages[i].aspectRatio.height * scaleY + 10; // Marge de 10 pixels entre chaque page
    }

    // Calculer la position y de la page cible
    const targetPageHeight = pages[targetPageIndex].aspectRatio.height * scaleY;
    const y = (canvasSize.height - targetPageHeight) / 2 - yOffset;

    return { x, y, scaleX, scaleY };
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
      console.log('#z center')
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
