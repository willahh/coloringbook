import * as fabric from 'fabric';
import { Page, Obj as ElementType } from '@/domain/book';
import { ObjectFactory } from './object/ObjectFactory';
import { DrawableObject } from './object/DrawableObject';

export const createPageGroup = async (
  page: Page,
  index: number,
  dimensions: { width: number; height: number }
): Promise<fabric.Group> => {
  // const size = { width: 1920, height: 1080 };
  const aspectRatio = page.aspectRatio.height / page.aspectRatio.width;
  const pageWidth = dimensions.width / 2;
  const pageHeight = pageWidth * aspectRatio;
  const offsetX = index * pageWidth;

  const pageBackground = new fabric.Rect({
    width: pageWidth,
    height: pageHeight,
    left: 0,
    top: 0,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    // selectable: false,
    // evented: false,
  });

  // ADD PAGE PREVIEW JPG in page list

  const elementPromises = page.elements.map((element: ElementType) =>
    ObjectFactory.createObject(element, pageWidth, pageHeight)
  );

  // Wait for all async operations to complete
  const elements = await Promise.all(elementPromises)
    .then((results) =>
      results.filter((obj): obj is DrawableObject => obj !== null)
    )
    .then((results) => Promise.all(results.map((obj) => obj.getObject())));

  return new fabric.Group([pageBackground, ...elements], {
    left: offsetX,
    top: 0,
    // selectable: false,
    // evented: false,
  });
};
