import { DrawableObject } from '../DrawableObject';
import * as fabric from 'fabric';
import { isShapeObject, ObjectAttributes } from '@/domain/book';

export class Circle implements DrawableObject {
  private circle: fabric.Circle;

  constructor(
    attrs: ObjectAttributes,
    relativeX: number,
    relativeY: number,
    radius: number
  ) {
    if (isShapeObject(attrs)) {
      this.circle = new fabric.Circle({
        left: relativeX,
        top: relativeY,
        radius: radius,
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
    return this.circle;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    console.log('draw', canvas);
    // canvas.add(this.circle);
    return this.circle;
  }

  update(attrs: ObjectAttributes): void {
    this.circle.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
