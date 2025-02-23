import { DrawableElement } from './DrawableElement';
import { Rectangle } from './types/Rectangle';
import { Circle } from './types/Circle';
import { Triangle } from './types/Triangle';
import { Text } from './types/Text';
import { SVG } from './types/SVG';
import { Image } from './types/Image';
import { Element } from '@apptypes/book'; // Assuming `Object` is renamed to avoid conflict with JS Object

export class ElementFactory {
  public static createElement(
    element: Element,
    offsetX: number,
    offsetY: number,
    pageWidth: number,
    pageHeight: number
  ): DrawableElement {
    const relativeX = offsetX + element.x * pageWidth;
    const relativeY = offsetY + element.y * pageHeight;
    const relativeW = element.w * pageWidth;
    const relativeH = element.h * pageHeight;

    console.log('#a createElement', 'pageWidth: ', pageWidth, ' - pageHeight: ', pageHeight, ' - relativeX: ', relativeX, 'relativeY:', relativeY, 'relativeW:', relativeW, 'relativeH:', relativeH);

    switch (element.type) {
      case 'rectangle':
        return new Rectangle(
          element,
          relativeX,
          relativeY,
          relativeW,
          relativeH
        );
        break;
      case 'circle':
        return new Circle(element, relativeX, relativeY, relativeW / 2);
        break;
      case 'triangle':
        return new Triangle(
          element,
          relativeX,
          relativeY,
          relativeW,
          relativeH
        );
        break;
      case 'text':
        return new Text(element, relativeX, relativeY);
        break;
      case 'svg':
        return new SVG(element, relativeX, relativeY, relativeW, relativeH);
        break;
      case 'image':
        return new Image(element, relativeX, relativeY, relativeW, relativeH);
      default:
        throw new Error(`Unknown element type: ${element}`);
    }
  }
}
