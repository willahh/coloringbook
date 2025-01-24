import { isShapeElement, isTextElement, Element } from '@/domain/book';
import * as fabric from 'fabric';

// Helper function for creating individual elements
export const createElement = (
  element: Element,
  pageWidth: number,
  pageHeight: number
) => {
  const relativeX = (element.x / 100) * pageWidth;
  const relativeY = (element.y / 100) * pageHeight;
  const relativeW = (element.w / 100) * pageWidth;
  const relativeH = (element.h / 100) * pageHeight;

  switch (element.type) {
    case 'rectangle':
      if (isShapeElement(element.attr)) {
        return new fabric.Rect({
          left: relativeX,
          top: relativeY,
          width: relativeW,
          height: relativeH,
          fill: element.attr.fill,
          stroke: element.attr.stroke,
          strokeWidth: element.attr.strokeWidth,
        });
      }
      break;

    case 'circle':
      if (isShapeElement(element.attr)) {
        return new fabric.Circle({
          left: relativeX,
          top: relativeY,
          radius: relativeW / 2,
          fill: element.attr.fill,
          stroke: element.attr.stroke,
          strokeWidth: element.attr.strokeWidth,
        });
      }
      break;

    case 'triangle':
      if (isShapeElement(element.attr)) {
        return new fabric.Triangle({
          left: relativeX,
          top: relativeY,
          width: relativeW,
          height: relativeH,
          fill: element.attr.fill,
          stroke: element.attr.stroke,
          strokeWidth: element.attr.strokeWidth,
        });
      }
      break;

    case 'text':
      if (isTextElement(element.attr)) {
        return new fabric.Text(element.attr.text.text, {
          left: relativeX,
          top: relativeY,
          fontSize: element.attr.text.fontSize,
          textAlign: element.attr.text.textAlign,
          fill: element.attr.text.color,
        });
      }
      break;

      // case 'image':
      //   if (isImageElement(element.attr) && canvasRef.current) {
      //     fabric.Image.fromURL(element.attr.imageData, (img) => {
      //       img.set({
      //         left: relativeX,
      //         top: relativeY,
      //         width: relativeW,
      //         height: relativeH,
      //       });
      //       canvasRef.current?.add(img);
      //     });
      //   }
      //   break;

      return null; // Return null as the image is added asynchronously
    default:
      return null;
  }
};
