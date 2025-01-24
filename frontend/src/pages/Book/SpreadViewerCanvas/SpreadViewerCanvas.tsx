import { debounce } from 'lodash';
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import * as fabric from 'fabric';
import { CanvasContext } from '../BookPage';
import {
  handleMouseWheel,
  handleMouseOver,
  handleMouseOut,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDocumentKeyDown,
  handleDocumentKeyUp,
} from './utils/canvasEvents';

import { createPageGroup } from './Page';

interface SpreadCanvasProps {
  width?: number;
  height?: number;
}

const SpreadViewerCanvas: React.FC<SpreadCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
  const { setCanvas, bookData } = useContext(CanvasContext);
  const [localPages, setLocalPages] = useState(bookData.pages);

  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) => {
      const canvas = new fabric.Canvas(canvasElement, {
        height: dimensions.height,
        width: dimensions.width,
        // backgroundColor: 'pink',
        selection: false,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
      });
      // onCanvasReady(canvas);
      return canvas;
    },
    [dimensions]
  );

  const updateDimensions = debounce(() => {
    if (containerRef.current) {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      const { clientWidth } = containerRef.current;
      setDimensions({ width: clientWidth, height: viewportHeight - 150 });
    }
  }, 200);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (JSON.stringify(localPages) !== JSON.stringify(bookData.pages)) {
      setLocalPages(bookData.pages);
    }
  }, [localPages, bookData.pages]);

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = initCanvas(canvasRef.current);
      const canvas = fabricCanvasRef.current;
      setCanvas(canvas);

      canvas.on('mouse:wheel', handleMouseWheel(canvas));
      canvas.on('mouse:over', handleMouseOver(canvas));
      canvas.on('mouse:out', handleMouseOut(canvas));
      canvas.on('mouse:down', handleMouseDown(canvas));
      canvas.on('mouse:move', handleMouseMove(canvas));
      canvas.on('mouse:up', handleMouseUp(canvas));

      // fixme: remove on unmount
      document.onkeydown = handleDocumentKeyDown(canvas);
      document.onkeyup = handleDocumentKeyUp(canvas);

      const pageGroups = localPages.map((page, index) =>
        createPageGroup(page, index, dimensions)
      );

      const allPagesGroup = new fabric.Group(pageGroups, {
        selectable: false,
        evented: false,
        left: 10,
        scaleX: 0.5,
        scaleY: 0.5,
        lockRotation: true,
      });

      canvas.add(allPagesGroup);
      canvas.setActiveObject(allPagesGroup);
      canvas.renderAll();

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, [dimensions, initCanvas, setCanvas, localPages]);

  return (
    <div ref={containerRef} className="flex-1">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpreadViewerCanvas;
