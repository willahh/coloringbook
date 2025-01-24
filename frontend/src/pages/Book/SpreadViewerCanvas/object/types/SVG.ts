import { DrawableObject } from '../DrawableObject';
import * as fabric from 'fabric';
import { isShapeObject, ObjectAttributes } from '@/domain/book';

export class SVG implements DrawableObject {
  private svg: fabric.Circle;

  constructor(
    attrs: ObjectAttributes,
    relativeX: number,
    relativeY: number,
    radius: number
  ) {
    if (isShapeObject(attrs)) {
      this.svg = new fabric.Circle({
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
    return this.svg;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    console.log('draw', canvas);
    return this.svg;
  }

  update(attrs: ObjectAttributes): void {
    this.svg.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
