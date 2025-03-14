import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Scrollbars } from '@/lib/scrollbars';
import { makeMouseWheelWithAnimation } from '@/lib/scrollbars/utils';
import canvasService from '@/services/CanvasService';
import useCanvasContext from '../../useCanvasContext';
import {
  getPrimary700Color,
  getPrimaryColor,
  getSecondaryColor,
} from '@/common/utils/themeColors';
import { useTouchControls } from './useTouchControls';
import useIsMobile from '@/common/hooks/useIsMobile';
import { useParams } from 'react-router-dom';
import { toDataURL } from 'node_modules/fabric/dist/src/util';

export function useCanvasInitialization(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
) {
  const { setCanvas, setViewportTransform } = useCanvasContext();
  const { pageId } = useParams<{ pageId?: string }>();
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const scrollbarInstance = useRef<Scrollbars | null>(null);
  const isMobile = useIsMobile();

  // État pour indiquer quand le canvas est prêt
  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('#c INSTANCIATE OF A NEW CANVAS');

    const container = canvasRef.current.closest(
      'div[data-id="cb-canvas-wrapper"]'
    );
    console.log(
      `#c initialize canvas with: width: ${container?.clientWidth},
      height: ${container?.clientHeight}, container: `,
      container
    );

    const width = container?.clientWidth || 0;
    const height = container?.clientHeight || 0;

    // Utiliser le devicePixelRatio pour augmenter la résolution
    // const pixelRatio = window.devicePixelRatio || 1;
    const pixelRatio = 1;
    const scaledWidth = width * pixelRatio;
    const scaledHeight = height * pixelRatio;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: scaledWidth,
      height: scaledHeight,
      selection: false,
      renderOnAddRemove: true,
      allowTouchScrolling: true,
      // enableRetinaScaling: true,
    });

    canvasInstance.current = canvas;
    setCanvas(canvas);
    canvasService.canvas = canvas;
    setIsCanvasReady(true); // Marquer le canvas comme prêt

    const mousewheel = makeMouseWheelWithAnimation(
      canvas,
      Number(pageId),
      { min: 0.02, max: 256 },
      true,
      setViewportTransform,
      isMobile
    );
    canvas.on('mouse:wheel', mousewheel);

    const scrollbar = new Scrollbars(canvas, {
      fill: getPrimaryColor(),
      stroke: getPrimary700Color(),
      lineWidth: 5,
      scrollbarSize: 8,
      offsetY: isMobile ? 0 : 62,
      hideX: isMobile ? true : false,
      hideY: isMobile ? true : false
    });
    scrollbarInstance.current = scrollbar;

    return () => {
      scrollbar.dispose();
      canvas.off('mouse:wheel', mousewheel);
      canvas.dispose();
      canvasInstance.current = null;
      scrollbarInstance.current = null;
      setIsCanvasReady(false); // Réinitialiser quand le canvas est détruit
    };
  }, [canvasRef, setCanvas, setViewportTransform, isMobile]);

  useTouchControls({
    canvas: canvasInstance.current,
    scrollbar: scrollbarInstance.current,
    setViewportTransform,
  });

  // Retourner l'instance du canvas uniquement quand elle est prête
  return isCanvasReady ? canvasInstance.current : null;
}
