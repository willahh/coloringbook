import { DrawableElement } from '../DrawableElement';
import * as fabric from 'fabric';
import { isShape, RectangleElement } from '@apptypes/book';

export class Rectangle implements DrawableElement {
  private rect: fabric.Rect;

  constructor(
    obj: RectangleElement,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    if (isShape(obj)) {
      this.rect = new fabric.Rect({
        left: relativeX,
        top: relativeY,
        width: relativeW,
        height: relativeH,
        fill: obj.attr.fill,
        stroke: obj.attr.stroke,
        strokeWidth: obj.attr.strokeWidth,
        
        
        selectable: true,
        hasControls: true
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

  update(attrs: RectangleElement): void {
    this.rect.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
