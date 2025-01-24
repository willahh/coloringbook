import { DrawableObject } from '../DrawableObject';
import * as fabric from 'fabric';
import { isShapeObject, ObjectAttributes } from '@/domain/book';

export class Rectangle implements DrawableObject {
  private rect: fabric.Rect;

  constructor(
    attrs: ObjectAttributes,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    if (isShapeObject(attrs)) {
      this.rect = new fabric.Rect({
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
    return this.rect;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    canvas.add(this.rect);
    return this.rect;
  }

  update(attrs: ObjectAttributes): void {
    this.rect.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
