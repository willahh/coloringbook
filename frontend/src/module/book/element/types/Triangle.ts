import * as fabric from 'fabric';
import { DrawableElement } from '../DrawableElement';
import { isShape, Element } from '@apptypes/book';

export class Triangle implements DrawableElement {
  private triangle: fabric.Triangle;

  constructor(
    obj: Element,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    if (isShape(obj)) {
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

  update(attrs: Element): void {
    this.triangle.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
