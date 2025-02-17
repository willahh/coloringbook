// @ts-nocheck
import { useEffect } from 'react';
import * as fabric from 'fabric';
import {
  handleMouseWheel,
  handleMouseOver,
  handleMouseOut,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDocumentKeyDown,
  handleDocumentKeyUp,
} from '../canvas.events';
import useCanvasContext from '../../useCanvasContext';
import { Element } from '@/common/types/book';
import { PageService } from '@/services/page.service';
import { useDispatch, useSelector } from '@/common/store';
import { selectBook } from '../../Book.slice';
import canvasService from '@/services/canvas.service';
import { updateElementByElementId } from '../../element/Element.action';
import { ElementService } from '@/services/element.service';

export const useEventHandlers = (canvas: fabric.Canvas | null) => {
  const dispatch = useDispatch();
  const { setViewportTransform } = useCanvasContext();
  const { book } = useSelector(selectBook);

  useEffect(() => {
    if (canvas) {
      const eventHandlers = {
        'mouse:wheel': handleMouseWheel(canvas, setViewportTransform),
        'mouse:over': handleMouseOver(canvas),
        'mouse:out': handleMouseOut(canvas),
        'mouse:down': handleMouseDown(canvas),
        'mouse:move': handleMouseMove(canvas),
        'mouse:up': handleMouseUp(canvas, setViewportTransform),
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
          console.log('fabricObject.getXY()', fabricObject.getXY());
          console.log(
            'fabricObject.getScaledWidth()',
            fabricObject.getScaledWidth()
          );
          console.log(
            'fabricObject.getRelativeXY()',
            fabricObject.getRelativeXY()
          );

          const pageId: number = fabricObject.get('pageId');
          const page = PageService.getPage(book.pages, pageId);
          if (page) {
            console.log('page', page);
            const pageDimensions = canvasService.getPageDimensions(
              canvas,
              pageId
            );
            const newElement: Element = {
              ...element,
              x: fabricObject.getRelativeX() / pageDimensions.width,
              y: fabricObject.getRelativeY() / pageDimensions.height,
              w: fabricObject.getScaledWidth() / pageDimensions.width,
              h: fabricObject.getScaledHeight() / pageDimensions.height,
            };
            console.log('newElement', newElement);
            console.log('pageDimensions', pageDimensions);
            dispatch(
              updateElementByElementId({ element: newElement, pageId: pageId })
            );
          }

          console.log('element', element);
          // debugger;
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
