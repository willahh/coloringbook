import { DrawableObject } from './DrawableObject';
import { Rectangle } from './types/Rectangle';
import { Circle } from './types/Circle';
import { Triangle } from './types/Triangle';
import { Text } from './types/Text';
import { SVG } from './types/SVG';
import { Obj } from '@/domain/book'; // Assuming `Object` is renamed to avoid conflict with JS Object

export class ObjectFactory {
  public static createObject(
    obj: Obj,
    offsetX: number,
    pageWidth: number,
    pageHeight: number
  ): DrawableObject | null {
    const relativeX = offsetX + ((obj.x / 100) * pageWidth);
    const relativeY = (obj.y / 100) * pageHeight;
    const relativeW = (obj.w / 100) * pageWidth;
    const relativeH = (obj.h / 100) * pageHeight;

    switch (obj.type) {
      case 'rectangle':
        return new Rectangle(obj, relativeX, relativeY, relativeW, relativeH);
      case 'circle':
        return new Circle(obj, relativeX, relativeY, relativeW / 2);
      case 'triangle':
        return new Triangle(obj, relativeX, relativeY, relativeW, relativeH);
      case 'text':
        return new Text(obj, relativeX, relativeY);
      case 'svg':
        return new SVG(obj, relativeX, relativeY, relativeW, relativeH);
      default:
        console.warn(`Unknown object type: ${obj.type}`);
        return null;
    }
  }
}
