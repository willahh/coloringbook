// hooks/usePageCreation.ts
import { Page } from '@/types/book';
import * as fabric from 'fabric';
import { useEffect, useState } from 'react';
import { ObjectFactory } from '../canvas/object/ObjectFactory';

export const usePageCreation = (
  canvas: fabric.Canvas | null,
  pageSpread: Page[],
  dimensions: { width: number; height: number }
) => {
  const [spreadSize, setSpreadSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    if (canvas) {
      const canvasBorder = 12;
      const newSpreadSize = { width: 0, height: 0 };

      pageSpread.forEach((page, index) => {
        const fitPageHeight =
          page.aspectRatio.width > page.aspectRatio.height ||
          dimensions.width > dimensions.height;
        let pageWidth = 0;
        let pageHeight = 0;

        if (fitPageHeight) {
          pageHeight = dimensions.height - canvasBorder * 2;
          pageWidth =
            pageHeight * (page.aspectRatio.width / page.aspectRatio.height) -
            canvasBorder * 2;
        } else {
          pageWidth = dimensions.width - canvasBorder * 2;
          pageHeight =
            pageWidth * (page.aspectRatio.height / page.aspectRatio.width) -
            canvasBorder * 2;
        }

        const offsetX = index * pageWidth;
        newSpreadSize.width += pageWidth;
        newSpreadSize.height = Math.max(newSpreadSize.height, pageHeight);

        const rect = new fabric.Rect({
          width: pageWidth,
          height: pageHeight,
          left: offsetX,
          top: 0,
          fill: 'white',
          selectable: false,
          shadow: new fabric.Shadow({
            color: 'rgba(0, 0, 0, .2)',
            nonScaling: true,
            blur: 4,
            offsetX: 2,
            offsetY: 2,
          }),
        });
        canvas.add(rect);

        // Create objects
        page.elements.forEach(async (element) => {
          const object = ObjectFactory.createObject(
            element,
            offsetX,
            pageWidth,
            pageHeight
          );
          const fabricObject = await object?.getObject();
          if (fabricObject) {
            fabricObject.set('objet', element);
            canvas.add(fabricObject);
          }
        });
      });

      // Create mask
      const mask = new fabric.Rect({
        width: newSpreadSize.width + canvasBorder,
        height: newSpreadSize.height + canvasBorder,
        left: -(canvasBorder / 2),
        top: -(canvasBorder / 2),
      });
      canvas.clipPath = mask;
      console.log('#3 setSpreadSize')
      setSpreadSize(newSpreadSize);
    }
  }, [canvas, pageSpread, dimensions]);
  return spreadSize;
};
