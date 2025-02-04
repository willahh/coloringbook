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
} from '../utils/canvasEvents';

export const useEventHandlers = (canvas: fabric.Canvas | null) => {
  useEffect(() => {
    if (canvas) {
      const eventHandlers = {
        'mouse:wheel': handleMouseWheel(canvas),
        'mouse:over': handleMouseOver(canvas),
        'mouse:out': handleMouseOut(canvas),
        'mouse:down': handleMouseDown(canvas),
        'mouse:move': handleMouseMove(canvas),
        'mouse:up': handleMouseUp(canvas),
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
