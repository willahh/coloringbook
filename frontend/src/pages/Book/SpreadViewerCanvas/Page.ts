import * as fabric from 'fabric';
import { Page, Element } from '@/domain/book';
import { createElement } from './Element';

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
    .map((element: Element) => createElement(element, pageWidth, pageHeight))
    .filter((el): el is fabric.Object => el !== null);

  return new fabric.Group([pageBackground, ...elements], {
    left: offsetX,
    top: 0,
    selectable: false,
    evented: false,
  });
};
