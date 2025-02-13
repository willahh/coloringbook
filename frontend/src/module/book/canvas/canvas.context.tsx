import React, { createContext, useState } from 'react';
import type { TMat2D } from 'fabric';

export type Scale = { scaleX: number; scaleY: number };
export type Position = { x: number; y: number };
interface CanvasContextProps {
  scale: Scale;
  position: Position;
  setScale: React.Dispatch<React.SetStateAction<Scale>>;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  viewportTransform: TMat2D;
  setViewportTransform: React.Dispatch<React.SetStateAction<TMat2D>>;
}

export const CanvasContext = createContext<CanvasContextProps | undefined>(
  undefined
);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scale, setScale] = useState<Scale>({ scaleX: 1, scaleY: 1 });
  const [position, setPosition] = useState<Position>({ x: 1, y: 1 });
  const [viewportTransform, setViewportTransform] = useState<TMat2D>([
    0, 0, 0, 0, 0, 0,
  ]);

  return (
    <CanvasContext.Provider
      value={{
        position: position,
        scale: scale,
        setScale: setScale,
        setPosition: setPosition,
        viewportTransform: viewportTransform,
        setViewportTransform: setViewportTransform,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
