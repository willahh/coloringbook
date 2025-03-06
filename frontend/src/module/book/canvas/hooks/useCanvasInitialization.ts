import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { Scrollbars } from '@/lib/scrollbars';
import { makeMouseWheelWithAnimation } from '@/lib/scrollbars/utils';
import canvasService from '@/services/canvas.service';
import useCanvasContext from '../../useCanvasContext';
import { getSecondaryColor } from '@/common/utils/themeColors';
import { useTouchControls } from './useTouchControls';

export function useCanvasInitialization(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
) {
  const { setCanvas, setViewportTransform } = useCanvasContext();
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const scrollbarInstance = useRef<Scrollbars | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('#c INSTANCIATE OF A NEW CANVAS');

    const container = canvasRef.current.closest(
      'div[data-id="cb-canvas-wrapper"]'
    );
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: container?.clientWidth,
      height: container?.clientHeight,
      selection: false,
      renderOnAddRemove: true,
      allowTouchScrolling: true,
    });

    canvasInstance.current = canvas;
    setCanvas(canvas);
    canvasService.canvas = canvas;

    const mousewheel = makeMouseWheelWithAnimation(
      canvas,
      { min: 0.02, max: 256 },
      true,
      setViewportTransform
    );
    canvas.on('mouse:wheel', mousewheel);

    const scrollbar = new Scrollbars(canvas, {
      fill: getSecondaryColor(),
      stroke: 'rgba(0,0,255,.5)',
      lineWidth: 5,
      scrollbarSize: 8,
      offsetY: 62,
    });
    scrollbarInstance.current = scrollbar;

    return () => {
      scrollbar.dispose();
      canvas.off('mouse:wheel', mousewheel);
      canvas.dispose();
      canvasInstance.current = null;
      scrollbarInstance.current = null;
    };
  }, [canvasRef, setCanvas, setViewportTransform]);

  useTouchControls({
    canvas: canvasInstance.current,
    scrollbar: scrollbarInstance.current,
    setViewportTransform,
  });
}
