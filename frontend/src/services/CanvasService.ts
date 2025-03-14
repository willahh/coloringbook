import * as fabric from 'fabric';
import { ElementFactory } from '@/module/book/element/ElementFactory';
import { Element, Page } from '@/common/types/book';
import {
  FabricRectPage,
  PageFabricObject,
  PageDimensions,
} from '@/common/interfaces';
import { Appearance } from '@/common/contexts/ThemeContext';
import * as themeColors from '@/common/utils/themeColors';

// Interface pour les dimensions du canvas
interface CanvasDimensions {
  canvasWidth: number;
  canvasHeight: number;
}

// Interface pour les dimensions de la page
interface PageDimensions {
  pageLeft: number;
  pageTop: number;
  pageWidth: number;
  pageHeight: number;
}

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

  getVerticalSpaceBetweenPages(isMobile: boolean) {
    return isMobile ? 60 : 200;
  }
  drawPagesElementsAndMask(
    canvas: fabric.Canvas,
    spreadPages: Page[],
    dimensions: { width: number; height: number },
    appearance: Appearance,
    isMobile: boolean
  ) {
    if (canvas && canvas.elements.lower) {
      // Ajout d'un garde fou personnalisé canvas.elements.lower car fabric.js
      // peut plancer sur un canvas.getElement()

      let activeFabricObject: fabric.FabricObject | null = null;
      if (canvas && canvas.getWidth() > 0) {
        console.info('#c CANVAS DRAW PAGES AND OBJECTS');

        canvas.clear();
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
          const spaceBetweenPages = this.getVerticalSpaceBetweenPages(isMobile);
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
            selectable: false,
            hoverCursor: 'default',

            strokeWidth: 4,
            // stroke: themeColors.secondaryColor,
            // stroke: 'transparent',

            shadow: new fabric.Shadow({
              color: 'rgba(0, 0, 0, .4)',
              nonScaling: true,
              blur: 8,
              offsetX: 2,
              offsetY: 2,
            }),
          });

          pageRect.on('mousedown:before', () => {
            if (
              isMobile || // Désactivation du focus sur la page au clic sur la page sur mobile
              canvas.getActiveObject() // Désactivation du focus sur la page si un objet est activé (mode édition)
            )
              return;

            // Focus sur la page, uniquement si aucune sélection n'est présente.
            // Evite le focus lorsque l'on a sélectionnée un élément, et que
            // l'on click sur la page pour le désélectionner.
            if (!canvas.__isPanning && canvas.getActiveObjects().length === 0) {
              this.pageFocus(canvas, spreadPages, page.pageId, isMobile);
            }
          });

          pageRect.on('mousedblclick', () => {
            this.pageFocus(canvas, spreadPages, page.pageId, isMobile);
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
              selectable: false,
              evented: false, // Disable events for text
              left: offsetX,
              top: offsetY + pageHeight + 8,
              fontSize: 16,
              fill: appearance === 'dark' ? 'white' : 'black',
              fontFamily: 'Arial',
            }
          );
          canvas.add(pageInfo);

          // TODO, gérer la sauvegarde de la sélection ICI

          // Ajoute les éléments au canvas
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
              // Disable immediate selection
              fabricObject.set({
                evented: true,
                hasControls: true, // Allow controls but only activate on release
                selectable: true,
              });

              // Enable selection on release
              // fabricObject.on('mouseup', () => {
              //   console.log('fabricObject mouseup')
              //   if (!canvas.__isPanning) {
              //     canvas.setActiveObject(fabricObject);
              //     canvas.renderAll();
              //   }
              // });
              // fabricObject.on('touchend', () => {
              //   if (!canvas.__isPanning) {
              //     canvas.setActiveObject(fabricObject);
              //     canvas.renderAll();
              //   }
              // });

              activeFabricObject = fabricObject;
            }
          });

          if (activeFabricObject) {
            canvas.setActiveObject(activeFabricObject);
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
      if (obj.get('pageId') === pageId) {
        return true;
      }
      return false;
    });

    return pageRect as FabricRectPage;
  }

  getPages(canvas: fabric.Canvas): PageFabricObject[] {
    const pages = canvas.getObjects().filter((obj) => {
      return (obj as fabric.Object & { isPage?: boolean }).isPage === true;
    }) as PageFabricObject[];

    return pages;
  }

  getMaxPageWidth(canvas: fabric.Canvas): number {
    const pages = canvasService.getPages(canvas);
    if (pages.length === 0) return 0;

    return Math.max(
      ...pages.map((page) => {
        return page.width || 0;
      })
    );
  }

  /**
   * Calcule la hauteur totale cumulée des pages avec une marge entre elles.
   */
  getTotalPageHeightCumulated(
    canvas: fabric.Canvas,
    isMobile: boolean
  ): number {
    const pages = canvasService.getPages(canvas);
    if (pages.length === 0) return 0;

    let totalHeight = 0;

    pages.forEach((page, index) => {
      totalHeight += page.height || 0;
      if (index < pages.length - 1) {
        totalHeight += this.getVerticalSpaceBetweenPages(isMobile);
      }
    });

    return totalHeight;
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

  getCanvasDimensions(isMobile: boolean): CanvasDimensions {
    const viewportWidth = window.innerWidth;
    const viewportHeight = Math.min(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    const headerHeight = 64;
    const footerHeight = 64;
    let canvasWidth = viewportWidth;
    let canvasHeight = viewportHeight;

    if (isMobile) {
      canvasWidth = viewportWidth;
      canvasHeight = viewportHeight - headerHeight - footerHeight;
    } else {
      const bookToolbarEl = document.querySelector(
        'div[data-id="book-toolbar"]'
      );
      const pagesPanelEl = document.querySelector('div[data-id="pages-panel"]');
      const pagesPanelElWidth = pagesPanelEl?.clientWidth || 0;
      const layerEl = document.querySelector('div[data-id="layer-panel"]');
      const layerElWidth = layerEl?.clientWidth || 0;
      const sidePanelEl = document.querySelector('aside[data-id="sidepanel"]');
      const sidePanelWidth = sidePanelEl?.clientWidth || 0;
      const bookToolbarWidth = bookToolbarEl?.clientWidth || 0;

      canvasWidth =
        viewportWidth -
        bookToolbarWidth -
        pagesPanelElWidth -
        sidePanelWidth -
        layerElWidth;
      canvasHeight = viewportHeight - headerHeight;
    }

    return { canvasWidth, canvasHeight };
  }

  getPageDimensions(canvas: fabric.Canvas, pageId: number): PageDimensions {
    const pageRect = this.getPageRectbyPageId(canvas, pageId);

    return {
      pageLeft: pageRect?.left || 0,
      pageTop: pageRect?.top || 0,
      pageWidth: pageRect?.width || 0,
      pageHeight: pageRect?.height || 0,
    };
  }

  getPageFocusMargin(isMobile: boolean) {
    return isMobile
      ? { verticalMargin: 20, horizontalMargin: 10 }
      : { verticalMargin: 24, horizontalMargin: 20 };
  }
  calculateZoomMin(
    canvasWidth: number,
    canvasHeight: number,
    pageWidth: number,
    pageHeight: number,
    isMobile: boolean
  ): number {
    const { verticalMargin, horizontalMargin } =
      this.getPageFocusMargin(isMobile);
    const zoomX = (canvasWidth - 2 * horizontalMargin) / pageWidth;
    const zoomY = (canvasHeight - 2 * verticalMargin) / pageHeight;
    const zoom = Math.min(zoomX, zoomY);

    return zoom;
  }

  getZoomMin(canvas: fabric.Canvas, pageId: number, isMobile: boolean): number {
    const { canvasWidth, canvasHeight } = this.getCanvasDimensions(isMobile);
    const { pageWidth, pageHeight } = this.getPageDimensions(canvas, pageId);

    const zoom = this.calculateZoomMin(
      canvasWidth,
      canvasHeight,
      pageWidth,
      pageHeight,
      isMobile
    );

    return zoom;
  }

  getPageFocusCoordinates(
    canvas: fabric.Canvas,
    pageId: number,
    isMobile: boolean
  ): fabric.TMat2D | null {
    const { canvasWidth, canvasHeight } = this.getCanvasDimensions(isMobile);
    const { pageLeft, pageTop, pageWidth, pageHeight } = this.getPageDimensions(
      canvas,
      pageId
    );

    const zoom = this.calculateZoomMin(
      canvasWidth,
      canvasHeight,
      pageWidth,
      pageHeight,
      isMobile
    );

    // Calculer le centre de la page et du canvas pour positionner correctement le viewport
    const centerPageX = pageLeft + pageWidth / 2;
    const centerPageY = pageTop + pageHeight / 2;
    const centerCanvasX = canvasWidth / 2;
    const centerCanvasY = canvasHeight / 2;
    const offsetY = isMobile ? 20 : 0;

    // Calculer le déplacement nécessaire pour centrer la page dans le canvas
    let deltaX = centerCanvasX - centerPageX * zoom;
    const deltaY = (centerCanvasY - centerPageY - offsetY) * zoom;

    // Appliquer la contrainte horizontale
    deltaX = this.constrainHorizontalMovement(
      canvasWidth,
      pageWidth * zoom,
      deltaX,
      isMobile
    );

    return [zoom, 0, 0, zoom, deltaX, deltaY];
  }

  static previousPagFocusId: number;
  pageFocus(
    canvas: fabric.Canvas,
    pages: Page[],
    pageId: number,
    isMobile: boolean
    // previousPageId?: number
  ): (() => void) | void {
    let focusPageId = pageId;
    if (focusPageId === 0) {
      focusPageId = pages[0].pageId;
    }

    const targetVpt = this.getPageFocusCoordinates(
      canvas,
      focusPageId,
      isMobile
    );
    if (targetVpt) {
      console.log('#c2 FOCUS ON PAGE pageId:', pageId);
      const currentVpt = [...canvas.viewportTransform];

      return this.animateViewportTransform(canvas, currentVpt, targetVpt);
    }
  }

  constrainHorizontalMovement(
    canvasWidth: number,
    maxPageWidth: number,
    x: number,
    isMobile: boolean
  ): number {
    let newX = x;

    // Limite de déplacement horizontal
    const margin = isMobile ? 20 : 100;
    const maxX = margin; // Si le contenu est aligné à gauche par défaut
    const minX = canvasWidth - maxPageWidth - margin; // Si le contenu dépasse la taille du canvas

    // Centrer le contenu si possible
    if (maxPageWidth <= canvasWidth) {
      // const offsetX = 77; // Largeur des onglets a gauche
      const offsetX = 0;
      newX = (canvasWidth - maxPageWidth + offsetX) / 2; // Centrer
      newX = canvasWidth / 2 - maxPageWidth / 2;
    } else {
      newX = Math.min(Math.max(x, minX), maxX);
    }
    return newX;
  }

  constrainVerticalMovement(
    canvasHeight: number,
    maxPageHeight: number,
    y: number,
    isMobile: boolean
  ): number {
    let newY = y;

    // Limite de déplacement vertical
    const headerHeight = 64;
    const footerHeight = 64;
    const footerPageOptionsHeight = 10;
    const marginTop = isMobile ? 20 : 100;
    const marginBottom = isMobile ? 20 : 100;
    const maxY = marginTop;
    const minY =
      canvasHeight -
      maxPageHeight -
      (headerHeight + footerHeight + 2 + footerPageOptionsHeight) -
      marginBottom;

    if (maxPageHeight <= canvasHeight) {
      // const offsetY = 77;
      const offsetY = 0;
      newY = (canvasHeight - maxPageHeight + offsetY) / 2;
    } else {
      newY = Math.min(Math.max(y, minY), maxY);
    }
    return newY;
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

      // Ajouter les écouteurs pour l’effet de survol
      // fabricObject.on('mouseover', (e: fabric.TPointerEventInfo) => {
      //   //console.log('#c2 mouseover');
      //   e.target?.set({
      //     stroke: '#ff0000', // Bordure rouge (ajustez selon votre thème, par exemple, tailwindColors.primary[700])
      //     strokeWidth: 2, // Épaisseur de la bordure (ajustez selon vos besoins)
      //     strokeDashArray: [5, 5], // Bordure pointillée (optionnel, pour un style plus subt

      //   });
      // });

      // fabricObject.on('mouseout', (e: fabric.TPointerEventInfo) => {
      //   //console.log('#c2 mouseout');
      //   e.target?.set({
      //     stroke: null, // Supprimer la bordure
      //     strokeWidth: 0, // Réinitialiser l’épaisseur
      //     strokeDashArray: null, // Réinitialiser le style pointillé
      //   });
      //   canvas.renderAll();
      //   // object.canvas?.renderAll(); // Forcer le rendu pour afficher les changements
      // });

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

  detectCurrentPage(canvas: fabric.Canvas, callbackfn: (id: number) => void) {
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
      const pageBottom = (page.getY() + (page.height ?? 0)) * zoom + offsetY;
      const viewportHeight = canvas.getHeight();

      // Calcul de la visibilité de la page dans la fenêtre
      const visibleHeight =
        Math.min(viewportHeight, pageBottom) - Math.max(0, pageTop);
      const visibilityRatio = visibleHeight / (page.height ?? 1);

      // Sélectionner la page la plus visible
      if (visibilityRatio > bestVisibility) {
        bestVisibility = visibilityRatio;
        bestPageId = page.pageId;
      }
    });

    if (bestPageId !== null) {
      callbackfn(bestPageId);
    }
  }

  public async generatePagePreview(
    page: Page,
    canvasDimensions: { width: number; height: number }
  ): Promise<string> {
    // Créer un canvas HTML temporaire
    const tempCanvasElement = document.createElement('canvas');
    tempCanvasElement.width = canvasDimensions.width;
    tempCanvasElement.height = canvasDimensions.height;

    // Initialiser Fabric.js avec cet élément canvas
    const tempCanvas = new fabric.Canvas(tempCanvasElement, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
    });

    // Dessiner le rectangle de page
    const pageRect = new fabric.Rect({
      isPage: true,
      pageId: page.pageId,
      width: canvasDimensions.width,
      height: canvasDimensions.height,
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
        0,
        0,
        canvasDimensions.width,
        canvasDimensions.height
      );
      const fabricObject = await drawableElement.getObject();
      if (fabricObject) {
        fabricObject.set('pageId', page.pageId); // Assure-toi que l'objet a un pageId
        tempCanvas.add(fabricObject);
      }
    }

    /*
     * Water marks –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     */
    const size = {
      width: Math.sqrt(
        canvasDimensions.width * canvasDimensions.width +
          canvasDimensions.height * canvasDimensions.height
      ),
      height: 28,
    };
    const diagonalBand = new fabric.Rect({
      width: size.width,
      height: size.height + 8,
      fill: themeColors.getSecondaryColor(),
      selectable: false,
      hasControls: false,
    });
    const watermarkText = new fabric.FabricText('© ColoringBook', {
      left: 22,
      top: 9,
      width: size.width,
      height: size.height,
      textAlign: 'center',
      fontSize: 18,
      fill: 'rgba(255, 255, 255, 1)',
      fontFamily: 'Arial',
      selectable: false,
      hasControls: false,
    });
    const watermarkGroup = new fabric.Group([diagonalBand, watermarkText], {
      left: 0,
      top: 0,
      angle: 45,
      opacity: 0.5,
      selectable: false,
      hasControls: false,
    });

    tempCanvas.add(watermarkGroup);

    tempCanvas.renderAll();

    const dataURL = tempCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.7,
      multiplier: 1,
    });

    // Nettoyer en disposant du canvas temporaire
    tempCanvas.dispose();

    return dataURL;
  }
}

const canvasService = new CanvasService();
export default canvasService;
