/**
 * TODO:
 *  - [ ] Refactor this file to use the new Object model
 *  - [ ] One object class by type
 *  - [ ] Object interface with common methods like, `draw`, `update`, `delete`
 */
import {
  isShapeObject,
  isSVGObject,
  isTextObject,
  Object,
} from '@/domain/book';
import * as fabric from 'fabric';

// Helper function for creating individual elements
export const createObject = (
  element: Object,
  pageWidth: number,
  pageHeight: number
) => {
  const relativeX = (element.x / 100) * pageWidth;
  const relativeY = (element.y / 100) * pageHeight;
  const relativeW = (element.w / 100) * pageWidth;
  const relativeH = (element.h / 100) * pageHeight;

  switch (element.type) {
    case 'rectangle':
      if (isShapeObject(element.attr)) {
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
      if (isShapeObject(element.attr)) {
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
      if (isShapeObject(element.attr)) {
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
      if (isTextObject(element.attr)) {
        return new fabric.Text(element.attr.text.text, {
          left: relativeX,
          top: relativeY,
          fontSize: element.attr.text.fontSize,
          textAlign: element.attr.text.textAlign,
          fill: element.attr.text.color,
        });
      }
      break;

    case 'svg':
      if (isSVGObject(element.attr)) {
        // const svgString ='';

        // fabric.loadSVGFromString(svgString, (results, options) => {
        //   const svgGroup = fabric.util.groupSVGElements(results, options);

        //   svgGroup.set({
        //     left: 100,
        //     top: 100
        //   });

        //   canvas.add(svgGroup);
        //   canvas.renderAll();
        // });
        return new fabric.Triangle({
          left: 1,
          top: 1,
          width: 10,
          height: 10,
          fill: '#000',
          // stroke: element.attr.stroke,
          // strokeWidth: element.attr.strokeWidth,
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
  }
};
