import { DrawableObject } from '../DrawableObject';
import * as fabric from 'fabric';
import { isShapeObject, CircleObject } from '@/domain/book';

// TODO: Il faut que le paramètre du constructeur
// soit de type Object {x,y,w,h,attr}
export class Circle implements DrawableObject {
  private circle: fabric.Circle;

  constructor(
    obj: CircleObject,
    relativeX: number,
    relativeY: number,
    radius: number
  ) {
    if (isShapeObject(obj)) {
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

  getObject(): fabric.Object {
    return this.circle;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    console.log('draw', canvas);
    // canvas.add(this.circle);
    return this.circle;
  }

  update(attrs: CircleObject): void {
    this.circle.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
