import React from 'react';
import * as fabric from 'fabric';

interface CanvasContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
}

export const CanvasContext = React.createContext<CanvasContextType>({
  canvas: null,
  setCanvas: () => {},
});

export const CanvasProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        setCanvas,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
