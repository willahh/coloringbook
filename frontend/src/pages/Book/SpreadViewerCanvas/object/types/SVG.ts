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
    // const svgString = `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"> <style> .small { font: italic 13px sans-serif; } .heavy { font: bold 30px sans-serif; } /* Note that the color of the text is set with the    * * fill property, the color property is for HTML only */ .Rrrrr { font: italic 40px serif; fill: red; } </style> <text x="20" y="35" class="small">My</text> <text x="40" y="35" class="heavy">cat</text> <text x="55" y="55" class="small">is</text> <text x="65" y="55" class="Rrrrr">Grumpy!</text> </svg>`;
    const svgGroup = await fabric.loadSVGFromString(obj.attr.svgContent);
    const svgFabricObject = svgGroup.objects.filter((obj) => obj !== null);
    const groupSVGElements = fabric.util.groupSVGElements(svgFabricObject, {});

    // this.svgObjects = svgFabricObject;
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
