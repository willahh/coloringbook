import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import * as fabric from 'fabric';
import { makeMouseWheel } from '@/lib/scrollbars/utils';

import { Page } from '@apptypes/book';
import { useEventHandlers } from './hooks/useEventHandlers';
import { useDimensions } from './hooks/useDimensions';
import canvasService from '@/services/canvas.service';
import { PagesNavigation } from '../components/PagesNavigation';

import { Scrollbars } from '@/lib/scrollbars';
import useCanvasContext from '../useCanvasContext';
import { BookPageParams } from '@/common/interfaces';
import { BookService } from '@/services/book.service';
import { TMat2D } from 'fabric';

interface SpreadCanvasProps {
  pageId: number;
  width?: number;
  height?: number;
  pages: Page[];
  sidePanelWidth: number;
  pagesPanelWidth: number;
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = ({
  pageId,
  pages,
  sidePanelWidth,
  pagesPanelWidth,
}) => {
  const pageParams = useParams<BookPageParams>();
  const { setCanvas, viewportTransform, setViewportTransform } =
    useCanvasContext();

  // State –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const [needPageCenter, setNeedPageCenter] = useState<boolean>(false);
  const [needRedrawPages, setNeedRedrawPages] = useState<boolean>(true);

  // Refs ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvas = fabricCanvasRef.current;

  // Process –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const canvasSize = useDimensions(
    containerRef,
    sidePanelWidth,
    pagesPanelWidth
  );

  console.log('#02 canvasSize', canvasSize)

  useEffect(() => {
    setNeedPageCenter(true);
  }, [pageId]);

  // useMemo to avoid too many re-renders
  const spreadPages = React.useMemo(
    () => BookService.getPageSpread(pageParams, pages),
    [pageParams, pages]
  );

  useEventHandlers(fabricCanvasRef.current);

  /**
   * [Canvas instanciation]
   * The canvas needs to be initialized with width and height in pixels.
   * Therefore, it must be refreshed when the browser is resized or the container size changes.
   */
  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) => {
      const canvasNew = new fabric.Canvas(canvasElement, {
        height: canvasSize.height,
        width: canvasSize.width - 50,
        selection: false,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
      });
      
      console.log('#02 canvasNew')
      canvasService.canvas = canvasNew;
      setNeedRedrawPages(true);

      return canvasNew;
    },
    [canvasSize]
  );

  /**
   * [Canvas reset]
   */
  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);
      const canvas = fabricCanvasRef.current as fabric.Canvas & {
        lastPosX?: number;
        lastPosY?: number;
      };

      setCanvas(canvas);

      const mousewheel = makeMouseWheel(canvas, { min: 0.02, max: 256 });
      canvas.on('mouse:wheel', mousewheel);

      const scrollbar = new Scrollbars(canvas, {
        fill: 'rgba(255,255,0,.5)',
        stroke: 'rgba(0,0,255,.5)',
        lineWidth: 5,
        scrollbarSize: 8,
        offsetY: 62, // Footer height
      });

      return () => {
        scrollbar.dispose();
        canvas.off('mouse:wheel', mousewheel);
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [initCanvas, setCanvas, spreadPages]);

  /**
   * [Canvas drawing].
   * Draw pages, elements and page mask.
   * The dependency array for pageCreation hook is only the canvas html reference.
   * Be cause the canvas is reset on browser resize, page change, or container changes.
   */
  useEffect(() => {
    if (canvas) {
      if (needRedrawPages) {
        const spreadSizeNew = canvasService.drawPagesElementsAndMask(
          canvas,
          spreadPages,
          canvasSize
        );

        // Center spread when viewportTransform is not defined (on page mount)
        if (spreadSizeNew) {
          if (needPageCenter) {
            const { x, y, scaleX, scaleY } =
              canvasService.calculateCenteredSpread(canvasSize, spreadSizeNew);

            // [scaleX, 0, 0, scaleY, x, y];
            const vpt: TMat2D = [scaleX, 0, 0, scaleY, x, y];
            setViewportTransform(vpt);
            setNeedPageCenter(false);
          }
          setNeedRedrawPages(false);
        }
      }

      if (viewportTransform) {
        canvas.viewportTransform = viewportTransform;
      }
    }
  }, [
    canvas,
    spreadPages,
    canvasSize,
    viewportTransform,
    needPageCenter,
    needRedrawPages,
    setViewportTransform,
  ]);

  useEffect(() => {
    if (canvas) {
      console.log('#001 pageId has changed !!!', pageId);

      // On page change, we reset the setViewportTransform
      setViewportTransform(undefined);
    }
  }, [pageId]); // pageId: Triggered when a page changes

  return (
    <div ref={containerRef} className="relative flex-1">
      <PagesNavigation />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadViewerCanvas;
