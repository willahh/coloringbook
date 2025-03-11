import { DrawableElement } from '../DrawableElement'; // Adjust the path as needed
import * as fabric from 'fabric';
import { SVGElement } from '@apptypes/book';
import { getAPIURL } from '@/common/utils/api';
import { getSecondaryColor } from '@/common/utils/themeColors';
export class SVG implements DrawableElement {
  private svgObjects: Promise<fabric.FabricObject> | null;

  constructor(
    obj: SVGElement,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    const newObj = { ...obj };
    newObj.w = relativeW;
    newObj.h = relativeH;
    newObj.x = relativeX;
    newObj.y = relativeY;
    this.svgObjects = this.createSVG(newObj);
  }

  private async createSVG(obj: SVGElement): Promise<fabric.FabricObject> {
    let groupSVGElements: fabric.FabricObject | null = null;
    if (obj.attr.svgContent) {
      // Load from an inline svg
      const svgGroup = await fabric.loadSVGFromString(obj.attr.svgContent);
      const svgFabricObject = svgGroup.objects.filter((obj) => obj !== null);

      // Calculer les dimensions originales du SVG
      let originalWidth = 0;
      let originalHeight = 0;
      let minX = Infinity;
      let minY = Infinity;
      svgFabricObject.forEach((object) => {
        if (object) {
          const objectBounds = object.getBoundingRect();
          const right = objectBounds.left + objectBounds.width;
          const bottom = objectBounds.top + objectBounds.height;
          // object.noScaleCache = true;
          // object.objectCaching = false;
          object.objectCaching = false;
          originalWidth = Math.max(originalWidth, right);
          originalHeight = Math.max(originalHeight, bottom);
          minX = Math.min(minX, objectBounds.left);
          minY = Math.min(minY, objectBounds.top);
        }
      });

      // Calculer l'échelle pour remplir l'espace sans distorsion
      const scaleX = obj.w / originalWidth;
      const scaleY = obj.h / originalHeight;
      const scale = Math.min(scaleX, scaleY); // On prend le plus petit pour conserver les proportions

      // Appliquer l'échelle à chaque objet du groupe et ajuster leur position
      svgGroup.objects.forEach((object) => {
        if (object) {
          const originalPos = object.getBoundingRect();
          object.scaleX = scale;
          object.scaleY = scale;
          // object.noScaleCache = true;
          object.objectCaching = false;
          // Ajuster la position pour que le SVG commence à (0, 0)
          object.left = (originalPos.left - minX) * scale;
          object.top = (originalPos.top - minY) * scale;
          // object.noScaleCache
        }
      });

      const groupProps: Partial<fabric.GroupProps> = {
        cornerColor: getSecondaryColor(),
        borderColor: getSecondaryColor(),
        hasBorders: true,

        cornerSize: 10,
        // noScaleCache: true,
        objectCaching: false, // <============== it works !!!!!!!!!!!!!!!!!!!!
        
        // Passer à true pour améliorer les perfs, voir ce que ça donne sur
        // des devices avec pas beaucoup de ram
        // objectCaching: true,

        cornerStyle: 'circle',
        borderScaleFactor: 2,
        borderOpacityWhenMoving: 100,

        borderDashArray: null,
        transparentCorners: false,

        // globalCompositeOperation: {}
      };
      groupSVGElements = fabric.util.groupSVGElements(
        svgFabricObject,
        groupProps
      );

      // Ajuster la taille du groupe pour qu'il corresponde aux dimensions spécifiées
      groupSVGElements.set({
        width: obj.w,
        height: obj.h,
        left: obj.x,
        top: obj.y,
      });
    } else if (obj.attr.svgURL) {
      // Load from an url
      const url = getAPIURL() + '/image/' + obj.attr.svgURL;
      const svgGroup = await fabric.loadSVGFromURL(url);
      const svgFabricObject = svgGroup.objects.filter((obj) => obj !== null);
      groupSVGElements = fabric.util.groupSVGElements(svgFabricObject, {
        // scaleX: 1 * window.devicePixelRatio,
        // scaleY: 1 * window.devicePixelRatio,
        // scaleX: 4,
        // scaleY: 4,
      });
      groupSVGElements.set({ objectCaching: false });
    }

    if (!groupSVGElements) {
      throw new Error('Failed to create SVG elements');
    }

    return groupSVGElements;
  }

  draw(canvas: fabric.Canvas): void {
    console.log('draw', canvas);
  }

  update(obj: SVGElement): void {
    console.log('obj', obj);
  }

  delete(): void {}

  async getObject(): Promise<fabric.Object> {
    if (!this.svgObjects) {
      throw new Error('SVG has not been created yet');
    }
    return await this.svgObjects;
  }
}
