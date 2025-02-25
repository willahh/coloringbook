import React, { useState } from 'react';
import * as fabric from 'fabric';

interface CanvasContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;

  viewportTransform?: fabric.TMat2D;
  setViewportTransform: React.Dispatch<
    React.SetStateAction<fabric.TMat2D | undefined>
  >;
}

export const CanvasContext = React.createContext<CanvasContextType>({
  canvas: null,
  setCanvas: () => {},
  setViewportTransform: () => {},
});

export const CanvasProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [viewportTransform, setViewportTransform] = useState<fabric.TMat2D>();

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        setCanvas,
        viewportTransform,
        setViewportTransform,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
