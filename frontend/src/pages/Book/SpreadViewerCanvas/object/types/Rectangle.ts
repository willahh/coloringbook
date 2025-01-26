import { DrawableObject } from '../DrawableObject';
import * as fabric from 'fabric';
import { isShapeObject, RectangleObject } from '@/domain/book';

export class Rectangle implements DrawableObject {
  private rect: fabric.Rect;

  constructor(
    obj: RectangleObject,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    if (isShapeObject(obj)) {
      this.rect = new fabric.Rect({
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
    return this.rect;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    canvas.add(this.rect);
    return this.rect;
  }

  update(attrs: RectangleObject): void {
    this.rect.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
