import * as fabric from 'fabric';
import { Page, Object as ElementType } from '@/domain/book';
import { ObjectFactory } from './object/ObjectFactory';
import { DrawableObject } from './object/DrawableObject';

export const createPageGroup = (
  page: Page,
  index: number,
  dimensions: { width: number; height: number }
) => {
  const aspectRatio = page.AspectRatio.h / page.AspectRatio.w;
  const pageWidth = dimensions.width / 2 - 10;
  const pageHeight = pageWidth / aspectRatio;
  const offsetX = index * pageWidth;

  const pageBackground = new fabric.Rect({
    width: pageWidth,
    height: pageHeight,
    left: 0,
    top: 0,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    selectable: false,
    evented: false,
  });

  const elements = page.elements
    .map((element: ElementType) =>
      ObjectFactory.createObject(element, pageWidth, pageHeight)
    )
    .filter((obj): obj is DrawableObject => obj !== null)
    .map((obj: DrawableObject) => obj.getObject());

  return new fabric.Group([pageBackground, ...elements], {
    left: offsetX,
    top: 0,
    selectable: false,
    evented: false,
  });
};
