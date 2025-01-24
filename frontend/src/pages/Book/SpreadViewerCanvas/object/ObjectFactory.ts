import { DrawableObject } from './DrawableObject';
import { Rectangle } from './types/Rectangle';
import { Circle } from './types/Circle';
import { Triangle } from './types/Triangle';
import { Text } from './types/Text';
import { SVG } from './types/SVG';
import { Object as ElementType } from '@/domain/book'; // Assuming `Object` is renamed to avoid conflict with JS Object

export class ObjectFactory {
  public static createObject(
    element: ElementType,
    pageWidth: number,
    pageHeight: number
  ): DrawableObject | null {
    const relativeX = (element.x / 100) * pageWidth;
    const relativeY = (element.y / 100) * pageHeight;
    const relativeW = (element.w / 100) * pageWidth;
    const relativeH = (element.h / 100) * pageHeight;

    switch (element.type) {
      case 'rectangle':
        return new Rectangle(
          element.attr,
          relativeX,
          relativeY,
          relativeW,
          relativeH
        );
      case 'circle':
        return new Circle(element.attr, relativeX, relativeY, relativeW / 2);
      case 'triangle':
        return new Triangle(
          element.attr,
          relativeX,
          relativeY,
          relativeW,
          relativeH
        );
      case 'text':
        return new Text(element.attr, relativeX, relativeY);
      case 'svg':
        return new SVG(element.attr, relativeX, relativeY, relativeW);
      default:
        console.warn(`Unknown object type: ${element.type}`);
        return null;
    }
  }
}
