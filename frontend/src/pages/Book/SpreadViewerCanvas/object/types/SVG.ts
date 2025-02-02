import { DrawableObject } from '../DrawableObject'; // Adjust the path as needed
import * as fabric from 'fabric';
import { SVGObject } from '@/domain/book';

export class SVG implements DrawableObject {
  private svgObjects: Promise<fabric.FabricObject> | null;

  constructor(
    obj: SVGObject,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    obj.w = relativeW;
    obj.h = relativeH;
    obj.x = relativeX;
    obj.y = relativeY;
    this.svgObjects = this.createSVG(obj);
  }

  private async createSVG(obj: SVGObject): Promise<fabric.FabricObject> {
    let groupSVGElements: fabric.FabricObject | null = null;
    if (obj.attr.svgContent) {
      // Load from an inline svg
      const svgGroup = await fabric.loadSVGFromString(obj.attr.svgContent);
      const svgFabricObject = svgGroup.objects.filter((obj) => obj !== null);
      groupSVGElements = fabric.util.groupSVGElements(svgFabricObject, {});
    } else if (obj.attr.svgURL) {
      // Load from an url
      // const url = obj.attr.svgURL;
      // const url = 'http://localhost:3000/image/' + 'uploads/graphic_asset/vect/1738524784688-732857514.svg';
      const url = 'http://localhost:3000/image/' + obj.attr.svgURL;
      console.log('url', url)
      const svgGroup = await fabric.loadSVGFromURL(url);
      const svgFabricObject = svgGroup.objects.filter((obj) => obj !== null);
      groupSVGElements = fabric.util.groupSVGElements(svgFabricObject, {});
    }

    if (!groupSVGElements) {
      throw new Error('Failed to create SVG elements');
    }

    return groupSVGElements;
  }

  draw(canvas: fabric.Canvas): void {
    console.log('draw', canvas);
    // if (this.svgObjects) {
    //   this.svgObjects.forEach((obj) => canvas.add(obj));
    //   return this.svgObjects;
    // } else {
    //   console.error('SVG group is not initialized yet');
    //   return null;
    // }
  }

  update(obj: SVGObject): void {
    console.log('obj', obj);
    // if ('svgContent' in obj && typeof obj.svgContent === 'string') {
    //   this.attrs.svgContent = obj.svgContent;
    //   this.createSVG();
    // }
    // if (this.svgGroup) {
    //   this.svgGroup.set({
    //     left: obj.x ?? this.svgGroup.left,
    //     top: obj.y ?? this.svgGroup.top,
    //     scaleX: obj.scaleX ?? this.svgGroup.scaleX,
    //     scaleY: obj.scaleY ?? this.svgGroup.scaleY,
    //   });
    // }
  }

  delete(): void {
    // if (this.svgObjects) {
    //   this.svgObjects.remove();
    // }
  }

  async getObject(): Promise<fabric.Object> {
    if (!this.svgObjects) {
      throw new Error('SVG has not been created yet');
    }
    return await this.svgObjects;
  }
}
