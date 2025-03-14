// @ts-nocheck
import { useEffect } from 'react';
import * as fabric from 'fabric';
import {
  handleMouseOver,
  handleMouseOut,
  handleMouseDown,
  handleDocumentKeyDown,
  handleDocumentKeyUp,
} from '../CanvasEvents';
import { Element } from '@/common/types/book';
import { useDispatch } from '@/common/store';
import canvasService from '@/services/CanvasService';
import { updateElementByElementId } from '../../element/Element.action';

export const useEventHandlers = (canvas: fabric.Canvas | null) => {
  const dispatch = useDispatch();

  /**
   * [Canvas.addEventHandlers]
   */
  useEffect(() => {
    if (canvas) {
      const eventHandlers = {
        'mouse:down': handleMouseDown(canvas),
        'mouse:over': handleMouseOver(canvas),
        'mouse:out': handleMouseOut(canvas),
      };

      Object.entries(eventHandlers).forEach(([event, handler]) => {
        canvas.on(event as keyof fabric.CanvasEvents, handler); // @ts-nocheck
      });
      
      canvas.on('object:modified', (e: fabric.ModifiedEvent) => {
        console.log('#03 object:modified', e);
        const fabricObject: fabric.FabricObject = e.target;
        const element: Element = fabricObject.get('objet');
        if (element) {
          const pageId: number = fabricObject.get('pageId');
          const pageRect = canvasService.getPageRectbyPageId(canvas, pageId);
          const offsetY = pageRect?.getY() || 0;

          const pageDimensions = canvasService.getPageDimensions(
            canvas,
            pageId
          );
          const newElement: Element = {
            ...element,
            x: fabricObject.getRelativeX() / pageDimensions.pageWidth,
            y: (fabricObject.getRelativeY() - offsetY) / pageDimensions.pageHeight,
            w: fabricObject.getScaledWidth() / pageDimensions.pageWidth,
            h: fabricObject.getScaledHeight() / pageDimensions.pageHeight,
          };
          console.log('newElement', newElement);
          dispatch(
            updateElementByElementId({ element: newElement, pageId: pageId })
          );
          // }
        }
      });

      document.onkeydown = handleDocumentKeyDown(canvas);
      document.onkeyup = handleDocumentKeyUp(canvas);

      return () => {
        Object.keys(eventHandlers).forEach((event) => {
          canvas.off(event as keyof fabric.CanvasEvents);
        });
        document.onkeydown = null;
        document.onkeyup = null;
      };
    }
  }, [canvas]);
};
