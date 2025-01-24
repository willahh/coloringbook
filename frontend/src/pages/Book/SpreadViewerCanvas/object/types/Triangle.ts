import * as fabric from 'fabric';
import { DrawableObject } from '../DrawableObject';
import { isShapeObject, ObjectAttributes } from '@/domain/book';

export class Triangle implements DrawableObject {
  private triangle: fabric.Triangle;

  constructor(
    attrs: ObjectAttributes,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    if (isShapeObject(attrs)) {
      this.triangle = new fabric.Triangle({
        left: relativeX,
        top: relativeY,
        width: relativeW,
        height: relativeH,
        fill: attrs.fill,
        stroke: attrs.stroke,
        strokeWidth: attrs.strokeWidth,
      });
    } else {
      throw new Error(
        'Attributes do not match expected shape object properties'
      );
    }
  }

  getObject(): fabric.Object {
    return this.triangle;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    console.log('draw', canvas);
    // canvas.add(this.triangle);
    return this.triangle;
  }

  update(attrs: ObjectAttributes): void {
    this.triangle.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
