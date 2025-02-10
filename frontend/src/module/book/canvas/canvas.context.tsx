import React, { createContext, useState } from 'react';
import type { TMat2D } from 'fabric';

export type Scale = { scaleX: number; scaleY: number };
export type Position = { x: number; y: number };
interface CanvasContextProps {
  //   canvasRef: RefObject<HTMLElement>;
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

  //   const canvasRef = React.useRef(null);
  //   const [zoomLevel, setZoomLevel] = useState(1); // Zoom par défaut à 100%

  //   // Fonction pour augmenter le zoom
  //   const zoomIn = useCallback(() => {
  //     setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Limite le zoom à 200%
  //   }, []);

  //   // Fonction pour diminuer le zoom
  //   const zoomOut = useCallback(() => {
  //     setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Limite le zoom à 50%
  //   }, []);

  //   return { children };

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
