import { DrawableObject } from '../DrawableObject'; // Adjust the path as needed
import * as fabric from 'fabric';
import { SVGObject } from '@/domain/book';

export class SVG implements DrawableObject {
  private svgGroup: fabric.Group | null = null;

  constructor(
    private obj: SVGObject,
    private relativeX: number,
    private relativeY: number,
    private relativeW: number,
    private relativeH: number
  ) {
    this.createSVG();
  }

  private createSVG(): void {
    fabric.loadSVGFromString(
      this.obj.attr.svgContent,
      (objects: unknown, options) => {
        const fabricObjects = objects as unknown as fabric.Object[];
        this.svgGroup = fabric.util.groupSVGElements(
          fabricObjects,
          options
        ) as fabric.Group;
        if (this.svgGroup) {
          this.svgGroup.set({
            left: this.relativeX,
            top: this.relativeY,
            scaleX: this.relativeW / this.svgGroup.width,
            scaleY: this.relativeH / this.svgGroup.height,
          });
        }
      }
    );
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    console.log('draw', canvas);
    if (this.svgGroup) {
      canvas.add(this.svgGroup);
      return this.svgGroup;
    } else {
      throw new Error('SVG group is not initialized yet');
    }
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
    if (this.svgGroup) {
      this.svgGroup.remove();
    }
  }

  getObject(): fabric.Object {
    if (!this.svgGroup) {
      throw new Error('SVG has not been created yet');
    }
    return this.svgGroup;
  }
}
