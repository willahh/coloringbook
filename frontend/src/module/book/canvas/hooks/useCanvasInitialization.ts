import { useEffect } from 'react';
import * as fabric from 'fabric';
import { Scrollbars } from '@/lib/scrollbars';
import { makeMouseWheelWithAnimation } from '@/lib/scrollbars/utils';
import canvasService from '@/services/canvas.service';
import useCanvasContext from '../../useCanvasContext';
import { secondaryColor } from '@/common/utils/themeColors';

export function useCanvasInitialization(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
) {
  const { setCanvas, setViewportTransform } = useCanvasContext();

  /**
   * [Canvas.initialize]
   * Only one instanciation on component mount
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('#c INSTANCIATE OF A NEW CANVAS');

    const container = canvasRef.current.closest('main');
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: container?.clientWidth,
      height: container?.clientHeight,
      selection: false,
      renderOnAddRemove: true,
      allowTouchScrolling: true,
    });

    setCanvas(canvas);
    canvasService.canvas = canvas;

    // Gestion du zoom et du scroll
    const mousewheel = makeMouseWheelWithAnimation(
      canvas,
      { min: 0.02, max: 256 },
      true,
      setViewportTransform
    );
    canvas.on('mouse:wheel', mousewheel);

    // Ajout des scrollbars
    const scrollbar = new Scrollbars(canvas, {
      fill: secondaryColor,
      // fill: '#f43f5f',
      stroke: 'rgba(0,0,255,.5)',
      lineWidth: 5,
      scrollbarSize: 8,
      offsetY: 62, // Footer height
    });

    return () => {
      scrollbar.dispose();
      canvas.off('mouse:wheel', mousewheel);
      canvas.dispose();
    };
  }, []);
}
