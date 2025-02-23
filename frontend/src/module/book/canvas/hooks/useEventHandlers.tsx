// @ts-nocheck
import { useEffect } from 'react';
import * as fabric from 'fabric';
import {
  handleMouseOver,
  handleMouseOut,
  handleMouseDown,
  handleDocumentKeyDown,
  handleDocumentKeyUp,
} from '../canvas.events';
import { Element } from '@/common/types/book';
import { useDispatch} from '@/common/store';
import canvasService from '@/services/canvas.service';
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
        'selection:created': (e: fabric.ObjectEvents) =>
          console.log('Selected:', e.selected),
        'selection:updated': (e: fabric.ObjectEvents) =>
          console.log('Selection Updated:', e.selected),
        'selection:cleared': (e: fabric.ObjectEvents) =>
          console.log('Selection Cleared', e),
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
            x: fabricObject.getRelativeX() / pageDimensions.width,
            y: (fabricObject.getRelativeY() - offsetY) / pageDimensions.height,
            w: fabricObject.getScaledWidth() / pageDimensions.width,
            h: fabricObject.getScaledHeight() / pageDimensions.height,
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
