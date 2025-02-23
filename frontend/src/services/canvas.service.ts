import { ElementFactory } from '@/module/book/element/ElementFactory';
import * as fabric from 'fabric';
import { Element, Page } from '@/common/types/book';
import {
  FabricRectPage,
  PageFabricObject,
  PageDimensions,
} from '@/common/interfaces';
import { Appearance } from '@/common/contexts/ThemeContext';

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
    dimensions: { width: number; height: number },
    appearance: Appearance
  ) {
    console.log('#a drawPagesElementsAndMask - dimensions', dimensions);
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

          // const scaleY = pageHeight / canvas.height;
          const spaceBetweenPages = 200;
          const offsetX = 0;
          const offsetY = index * (pageHeight + spaceBetweenPages);

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

          // pageRect.on('mouseover', () => {
          //   console.log('on mouseover');

          //   pageRect.set({
          //     stroke: 'green',
          //     strokeWidth: 10,
          //   } as fabric.RectProps);
          //   canvas.renderAll();
          // });

          // pageRect.on('mouseout', () => {
          //   pageRect.set({
          //     stroke: 'green',
          //     strokeWidth: 0,
          //   } as fabric.RectProps);
          //   canvas.renderAll();
          // });
          canvas.add(pageRect);

          const pageInfo = new fabric.Text(
            `Page ${page.pageNumber} / ${spreadPages.length}`,
            {
              left: offsetX,
              top: offsetY + pageHeight + 8,
              fontSize: 16,
              fill: appearance === 'dark' ? 'white' : 'black',
              fontFamily: 'Arial',
            }
          );
          canvas.add(pageInfo);

          // TODO, gérer la sauvegarde de la sélection ICI

          // Create page elements

          page.elements.forEach(async (element) => {
            const fabricObject = await canvasService.addElementToCanvas(
              canvas,
              page.pageId,
              element,
              offsetX,
              offsetY,
              pageWidth,
              pageHeight
            );

            if (fabricObject) {
              activeFabricObject = fabricObject;
            }
          });

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

  getPageRectbyPageId(
    canvas: fabric.Canvas,
    pageId: number
  ): FabricRectPage | undefined {
    const pageRect = canvas.getObjects().find((obj) => {
      if (
        obj.type === 'rect' &&
        (obj as FabricRectPage).pageId === Number(pageId)
      ) {
        return true;
      }
      return false;
    });

    return pageRect as FabricRectPage;
  }

  getPageDimensions(canvas: fabric.Canvas, pageId: number): PageDimensions {
    let pageDimensions = {
      width: 0,
      height: 0,
    };
    const pageRect = this.getPageRectbyPageId(canvas, pageId);

    if (pageRect) {
      pageDimensions = {
        width: pageRect.width,
        height: pageRect.height,
      };
    }

    return pageDimensions;
  }

  getPages(canvas: fabric.Canvas): PageFabricObject[] {
    const pages = canvas.getObjects().filter((obj) => {
      return (obj as fabric.Object & { isPage?: boolean }).isPage === true;
    }) as PageFabricObject[];

    return pages;
  }

  getMaxPageWidth(canvas: fabric.Canvas): number {
    const pages = canvasService.getPages(canvas);
    if (pages.length === 0) return 0; // Si aucune page, largeur totale est 0

    // Calculer la largeur max parmi toutes les pages
    return Math.max(
      ...pages.map((page) => {
        return page.width || 0;
      })
    );
  }

  getMaxPageScaledWidth(canvas: fabric.Canvas): number {
    const pages = canvasService.getPages(canvas);
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
    margin = 40
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
    const canvasHeight = canvas.getHeight() - 66; // 66 = Hauteur du footer

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
    let deltaX = centerCanvasX - centerPageX * zoom;
    const deltaY = centerCanvasY - centerPageY * zoom;

    // Appliquer la contrainte horizontale
    deltaX = this.constrainHorizontalMovement(
      canvasWidth,
      pageWidth * zoom,
      deltaX
    );

    // Construire et retourner le viewport transform
    return [zoom, 0, 0, zoom, deltaX, deltaY];
  }

  constrainHorizontalMovement(
    canvasWidth: number,
    maxPageWidth: number,
    x: number
  ): number {
    let newX = x;

    // Limite de déplacement horizontal
    const margin = 100;
    const maxX = margin; // Si le contenu est aligné à gauche par défaut
    const minX = canvasWidth - maxPageWidth - margin; // Si le contenu dépasse la taille du canvas

    // Centrer le contenu si possible
    if (maxPageWidth <= canvasWidth) {
      const offsetX = 77; // Largeur des onglets a gauche
      newX = (canvasWidth - maxPageWidth + offsetX) / 2; // Centrer
    } else {
      newX = Math.min(Math.max(x, minX), maxX);
    }
    return newX;
  }

  async addElementToCanvas(
    canvas: fabric.Canvas,
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
    if (fabricObject && canvas) {
      fabricObject.set('objet', element);
      fabricObject.set('pageId', pageId);
      canvas.add(fabricObject);
    }
    return fabricObject;
  }

  // Quadratic In (accélère progressivement)
  quadraticIn(t: number): number {
    return t * t;
  }

  // Quadratic Out (décélère progressivement)
  quadraticOut(t: number): number {
    return t * (2 - t);
  }

  // Quadratic InOut (commence lentement, accélère, puis ralentit)
  quadraticInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // Fonction pour l'animation Elastic In
  elasticIn(t: number): number {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, 10 * (t - 1)) *
        Math.sin(((t - 1 - c4) * (2 * Math.PI)) / 0.3);
  }

  // Fonction pour l'animation Elastic Out
  elasticOut(t: number): number {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin(((t - c4) * (2 * Math.PI)) / 0.3) + 1;
  }

  // Fonction pour l'animation Elastic InOut
  elasticInOut(t: number): number {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : t < 0.5
      ? 0.5 * Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)
      : Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5) * 0.5 + 1;
  }

  // Fonction Elastic douce InOut
  elasticInOutSoft(t: number): number {
    const c5 = (2 * Math.PI) / 5; // Moins de fréquence pour un rebond plus doux
    return t === 0
      ? 0
      : t === 1
      ? 1
      : t < 0.5
      ? 0.5 * Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)
      : Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5) * 0.5 + 1;
  }

  // Fonction pour calculer l'interpolation Bézier quadratique
  quadraticBezier(t: number, p0: number, p1: number, p2: number): number {
    const oneMinusT = 1 - t;
    return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2;
  }

  // Fonction pour animer le viewport
  animateViewportTransform(
    canvas: fabric.Canvas,
    currentVpt: number[],
    targetVpt: number[],
    animationDuration: number = 500
  ) {
    const startTime = performance.now();
    let animationFrameId: number;

    // Fonction d'animation qui sera appelée à chaque frame
    const animate = (timestamp: number) => {
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      // Appliquer l'animation élastique
      const easingProgress = this.quadraticOut(progress);

      // Appliquer l'interpolation élastique pour chaque valeur
      const zoom =
        currentVpt[0] + (targetVpt[0] - currentVpt[0]) * easingProgress;
      const deltaX =
        currentVpt[4] + (targetVpt[4] - currentVpt[4]) * easingProgress;
      const deltaY =
        currentVpt[5] + (targetVpt[5] - currentVpt[5]) * easingProgress;

      // Appliquer la nouvelle transformation à chaque étape
      canvas.setViewportTransform([zoom, 0, 0, zoom, deltaX, deltaY]);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        canvas.requestRenderAll();
      }
    };

    // Démarrer l'animation
    animationFrameId = requestAnimationFrame(animate);

    // Retourner la fonction d'annulation si nécessaire
    return () => cancelAnimationFrame(animationFrameId);
  }

  detectCurrentPage(
    canvas: fabric.Canvas,
    setSelectedPageId: (id: number) => void
  ) {
    const vpt = canvas.viewportTransform;
    if (!vpt) return;

    const zoom = vpt[0]; // Échelle actuelle
    const offsetY = vpt[5]; // Position verticale du viewport

    // Liste des pages avec leurs positions
    const pages = this.getPages(canvas);
    let bestPageId = null;
    let bestVisibility = 0;

    pages.forEach((page) => {
      const pageTop = page.getY() * zoom + offsetY;
      const pageBottom = (page.getY() + page.height) * zoom + offsetY;
      const viewportHeight = canvas.getHeight();

      // Calcul de la visibilité de la page dans la fenêtre
      const visibleHeight =
        Math.min(viewportHeight, pageBottom) - Math.max(0, pageTop);
      const visibilityRatio = visibleHeight / page.height;

      // Sélectionner la page la plus visible
      if (visibilityRatio > bestVisibility) {
        bestVisibility = visibilityRatio;
        bestPageId = page.pageId;
      }
    });

    if (bestPageId !== null) {
      setSelectedPageId(bestPageId);
    }
  }

  // public generatePagePreview(
  //   page: Page,
  //   dimensions: { width: number; height: number },
  //   appearance: Appearance
  // ): string {
  //   const tempCanvas = new fabric.Canvas(null, {
  //     width: 100, // Taille réduite pour la preview
  //     height: 141, // Proportions A4 (1:1.414)
  //   });

  //   // Dessiner la page et ses éléments sur un canvas temporaire
  //   this.drawPagesElementsAndMask(tempCanvas, [page], dimensions, appearance);
  //   return tempCanvas.toDataURL(); // Retourne une image encodée en base64
  // }

  public async generatePagePreview(
    page: Page,
    dimensions: { width: number; height: number }
  ): Promise<string> {
    console.log('#a generatePagePreview');

    // Créer un canvas HTML temporaire
    const tempCanvasElement = document.createElement('canvas');
    tempCanvasElement.width = dimensions.width; // Définir la largeur
    tempCanvasElement.height = dimensions.height; // Définir la hauteur

    // Initialiser Fabric.js avec cet élément canvas
    const tempCanvas = new fabric.Canvas(tempCanvasElement, {
      width: dimensions.width,
      height: dimensions.height,
    });

    // Dessiner la page et ses éléments sur le canvas temporaire
    // this.drawPagesElementsAndMask(tempCanvas, [page], dimensions, appearance);

    // Dessiner le rectangle de page (fond blanc)
    const pageRect = new fabric.Rect({
      isPage: true,
      pageId: page.pageId,
      width: dimensions.width,
      height: dimensions.height,
      left: 0,
      top: 0,
      fill: 'white',
      hasControls: false,
      selectable: false,
    });
    tempCanvas.add(pageRect);

    // Dessiner chaque élément de la page sur le canvas temporaire
    for (const element of page.elements) {
      const drawableElement = ElementFactory.createElement(
        element,
        0, // offsetX (position relative dans la preview)
        0, // offsetY (position relative dans la preview)
        dimensions.width,
        dimensions.height
      );
      const fabricObject = await drawableElement.getObject();
      if (fabricObject) {
        fabricObject.set('pageId', page.pageId); // Assure-toi que l'objet a un pageId
        tempCanvas.add(fabricObject);
      }
    }

    // Forcer le rendu pour s'assurer que tout est dessiné
    tempCanvas.renderAll();

    const dataURL = tempCanvas.toDataURL({
      format: 'jpeg', // Utiliser JPG au lieu de PNG
      quality: 0.7, // Qualité de compression (0 à 1, 0.7 = 70% de qualité, équilibré)
      multiplier: 0.8, // Réduire la taille pour une preview légère (optionnel)
    }); // Générer la data URL
    console.log('#a dataURL', dataURL);

    // Nettoyer en disposant du canvas temporaire
    tempCanvas.dispose();

    return dataURL;
  }
}

const canvasService = new CanvasService();
export default canvasService;
