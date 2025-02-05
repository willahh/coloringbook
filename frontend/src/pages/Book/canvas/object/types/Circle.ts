import { DrawableObject } from '../DrawableObject';
import * as fabric from 'fabric';
import { isShape, CircleElement } from '@/domain/book';

// TODO: Il faut que le paramètre du constructeur
// soit de type Object {x,y,w,h,attr}
export class Circle implements DrawableObject {
  private circle: fabric.Circle;

  constructor(
    obj: CircleElement,
    relativeX: number,
    relativeY: number,
    radius: number
  ) {
    if (isShape(obj)) {
      this.circle = new fabric.Circle({
        left: relativeX,
        top: relativeY,
        radius: radius,
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
    return this.circle;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    console.log('draw', canvas);
    // canvas.add(this.circle);
    return this.circle;
  }

  update(attrs: CircleElement): void {
    this.circle.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
