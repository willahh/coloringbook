import * as fabric from 'fabric';
import { DrawableObject } from '../DrawableObject';
import { isShapeObject, Obj } from '@/domain/book';

export class Triangle implements DrawableObject {
  private triangle: fabric.Triangle;

  constructor(
    obj: Obj,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    if (isShapeObject(obj)) {
      this.triangle = new fabric.Triangle({
        left: relativeX,
        top: relativeY,
        width: relativeW,
        height: relativeH,
        fill: obj.attr.fill,
        stroke: obj.attr.stroke,
        strokeWidth: obj.attr.strokeWidth,
      });
    } else {
      throw new Error(
        'Attributes do not match expected shape object properties'
      );
    }
  }

  async getObject(): Promise<fabric.Object> {
    return this.triangle;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    console.log('draw', canvas);
    // canvas.add(this.triangle);
    return this.triangle;
  }

  update(attrs: Obj): void {
    this.triangle.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
