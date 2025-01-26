import * as fabric from 'fabric';
import { Page, Obj as ElementType } from '@/domain/book';
import { ObjectFactory } from './object/ObjectFactory';
import { DrawableObject } from './object/DrawableObject';

export const createPageGroup = async (
  page: Page,
  index: number,
  dimensions: { width: number; height: number }
): Promise<fabric.Group> => {
  const aspectRatio = page.aspectRatio.height / page.aspectRatio.width;
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

  // const svgString = `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"> <style> .small { font: italic 13px sans-serif; } .heavy { font: bold 30px sans-serif; } /* Note that the color of the text is set with the    * * fill property, the color property is for HTML only */ .Rrrrr { font: italic 40px serif; fill: red; } </style> <text x="20" y="35" class="small">My</text> <text x="40" y="35" class="heavy">cat</text> <text x="55" y="55" class="small">is</text> <text x="65" y="55" class="Rrrrr">Grumpy!</text> </svg>`;
  // fabric.parseSVGDocument()
  // const svgObject = await fabric.loadSVGFromString(svgString);

  // TODO code qui fonctionne :
  // const rect1 = new fabric.Rect({
  //   width: 20,
  //   height: 40,
  //   left: 0,
  //   top: 20,
  //   fill: 'white',
  //   stroke: 'black',
  //   strokeWidth: 2,
  //   selectable: false,
  //   evented: false,
  // });

  // const svgGroup = await fabric.loadSVGFromString(svgString);
  // const svgFabricObject = svgGroup.objects.filter((obj) => obj !== null);

  // return new fabric.Group([pageBackground, rect1, ...svgFabricObject], {
  //   left: offsetX,
  //   top: 0,
  //   selectable: false,
  //   evented: false,
  // });

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
    selectable: false,
    evented: false,
  });
};
