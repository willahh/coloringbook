import React, { useState } from 'react';
import * as fabric from 'fabric';

interface CanvasContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  canvasTransform: [
    fabric.TMat2D,
    React.Dispatch<React.SetStateAction<fabric.TMat2D>>
  ];
}

export const CanvasContext = React.createContext<CanvasContextType>({
  canvas: null,
  setCanvas: () => {},
  canvasTransform: [[0, 0, 0, 0, 0, 0], () => {}],
});

export const CanvasProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const canvasTransform = useState<fabric.TMat2D>([0, 0, 0, 0, 0, 0]);

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        setCanvas,
        canvasTransform,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
