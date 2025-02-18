import canvasService from '@/services/canvas.service';
import * as fabric from 'fabric';
// import { Position, Scale } from './canvas.context';

declare module 'fabric' {
  interface Canvas {
    objSelected?: fabric.Object | null;
    lastPosX?: number;
    lastPosY?: number;
    isDragging?: boolean;
    dragHistory?: DragHistory[];
  }
}

// Nouvelle variable pour stocker les positions récentes
interface DragHistory {
  time: number;
  x: number;
  y: number;
}

function startZoomMomentum(
  canvas: fabric.Canvas,
  setViewportTransform: React.Dispatch<React.SetStateAction<fabric.TMat2D>>,
  initialZoomSpeed: number,
  mousePoint: fabric.Point
) {
  let zoomMomentum = initialZoomSpeed;
  let lastTime = performance.now();

  function animateZoomMomentum() {
    const now = performance.now();
    const timeDiff = now - lastTime;
    const currentZoom = canvas.getZoom();
    const newZoom = currentZoom + (zoomMomentum * timeDiff) / 1000; // Ajuster le facteur de temps selon besoin
    let appliedZoom = newZoom;

    const zoomMin = 0.4;
    if (appliedZoom > 5) appliedZoom = 5;
    if (appliedZoom < zoomMin) appliedZoom = zoomMin;

    // canvas.setZoom(appliedZoom);
    canvas.zoomToPoint(mousePoint, appliedZoom);
    setViewportTransform([...canvas.viewportTransform]);

    // Appliquer la friction au momentum
    zoomMomentum *= 0.98; // Friction pour le zoom
    lastTime = now;

    if (Math.abs(zoomMomentum) > 0.001) {
      // Vitesse minimale pour continuer l'animation
      requestAnimationFrame(animateZoomMomentum);
    }
  }

  // Démarrer l'animation
  requestAnimationFrame(animateZoomMomentum);
}

const zoomHistory: { time: number; zoom: number }[] = [];

export const handleMouseWheel =
  (
    canvas: fabric.Canvas,
    setViewportTransform: React.Dispatch<React.SetStateAction<fabric.TMat2D>>
  ) =>
  (opt: fabric.TEvent<WheelEvent>) => {
    // opt.e.preventDefault();
    // opt.e.stopPropagation();

    // // Vérifier si l'événement est un zoom (pinch to zoom) sur un trackpad
    // if (opt.e.ctrlKey || opt.e.metaKey) {
    //   // Sur Mac, metaKey est utilisé pour le zoom
    //   const delta = opt.e.deltaY;
    //   let zoom = canvas.getZoom();
    //   const zoomMin = 0.4;
    //   const zoomMax = 5;
    //   zoom *= 0.998 ** delta;
    //   if (zoom > zoomMax) zoom = zoomMax;
    //   if (zoom < zoomMin) zoom = zoomMin;

    //   const canvasWidth = canvas.getWidth();
    //   const totalWidth = canvasService.getMaxPageWidth(canvas);
    //   const mousePoint = new fabric.Point(opt.e.offsetX, opt.e.offsetY);
    //   const newX = canvasService.constrainHorizontalMovement(
    //     canvasWidth,
    //     totalWidth,
    //     mousePoint.x
    //   );
    //   console.log('\n\n#z');
    //   console.log('#z canvasWidth', canvasWidth);
    //   console.log('#z totalWidth', totalWidth);
    //   console.log('#z newX', newX);
    //   console.log('#z opt.e.offsetX', opt.e.offsetX);

    //   console.log('#z mousePoint', mousePoint);
    //   canvas.zoomToPoint(mousePoint, zoom);

    //   setViewportTransform([...canvas.viewportTransform]);

    //   // Ajouter le nouveau zoom à l'historique
    //   zoomHistory.push({ time: performance.now(), zoom });
    //   if (zoomHistory.length > 10) {
    //     zoomHistory.shift();
    //   }

    //   // Calculer et déclencher immédiatement le momentum du zoom
    //   if (zoomHistory.length > 1) {
    //     const lastZoom = zoomHistory[zoomHistory.length - 1];
    //     const prevZoom = zoomHistory[zoomHistory.length - 2];
    //     const timeDiff = lastZoom.time - prevZoom.time;
    //     if (timeDiff > 0) {
    //       const zoomDiff = lastZoom.zoom - prevZoom.zoom;
    //       const zoomSpeed = (zoomDiff / timeDiff) * 10;
    //       startZoomMomentum(
    //         canvas,
    //         setViewportTransform,
    //         zoomSpeed,
    //         mousePoint
    //       );
    //     }
    //   }
    // }
  };
export const handleMouseOver =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    if (opt.target) {
      canvas.objSelected = opt.target;
    }
  };

export const handleMouseOut =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    if (opt.target) {
      canvas.objSelected = null;
    }
  };

export const handleMouseDown =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    if (!opt.e.ctrlKey && !opt.e.metaKey) {
      // Assure que ce n'est pas un événement de zoom
      const evt = opt.e;
      if (evt.altKey === true) {
        canvas.isDragging = true;
        canvas.selection = false;
        if (evt instanceof MouseEvent) {
          canvas.lastPosX = evt.clientX;
          canvas.lastPosY = evt.clientY;
        } else if (evt instanceof TouchEvent) {
          canvas.lastPosX = evt.touches[0].clientX;
          canvas.lastPosY = evt.touches[0].clientY;
        }
      }
    }
  };

export const handleMouseMove =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    // if (canvas.isDragging && !opt.e.ctrlKey && !opt.e.metaKey) {
    //   const e = opt.e;
    //   const vpt = canvas.viewportTransform;
    //   let clientX: number, clientY: number;
    //   if (e instanceof MouseEvent) {
    //     clientX = e.clientX;
    //     clientY = e.clientY;
    //   } else if (e instanceof TouchEvent) {
    //     clientX = e.touches[0].clientX;
    //     clientY = e.touches[0].clientY;
    //   } else {
    //     return; // Si ce n'est ni un MouseEvent ni un TouchEvent, on sort
    //   }
    //   // Calculer le déplacement
    //   const moveX = (canvas.lastPosX ?? 0) - clientX;
    //   const moveY = (canvas.lastPosY ?? 0) - clientY;
    //   // Mettre à jour la position
    //   vpt[4] -= moveX;
    //   vpt[5] -= moveY;
    //   // Garder une trace des mouvements récents pour calculer la vélocité
    //   if (!canvas.dragHistory) {
    //     canvas.dragHistory = [];
    //   }
    //   canvas.dragHistory.push({ time: Date.now(), x: clientX, y: clientY });
    //   // Garder seulement les 10 dernières positions pour éviter une surcharge de mémoire
    //   if (canvas.dragHistory.length > 10) {
    //     canvas.dragHistory.shift();
    //   }
    //   canvas.lastPosX = clientX;
    //   canvas.lastPosY = clientY;
    //   canvas.requestRenderAll();
    // }
  };

// Nouvelle fonction handleMouseUp avec animation de glissement
// Nouvelle fonction handleMouseUp avec animation de glissement
export const handleMouseUp =
  (
    canvas: fabric.Canvas,
    setViewportTransform: React.Dispatch<React.SetStateAction<fabric.TMat2D>>
  ) =>
  () => {
    // canvas.setViewportTransform(canvas.viewportTransform);
    // setViewportTransform([...canvas.viewportTransform]);
    // canvas.isDragging = false;
    // canvas.selection = true;
    // canvas.defaultCursor = 'default';
    // const dragHistory = canvas.dragHistory || [];
    // if (dragHistory.length < 3) return; // Utiliser au moins 3 points pour la vélocité
    // const lastMove = dragHistory[dragHistory.length - 1];
    // const prevMove = dragHistory[dragHistory.length - 3]; // Utiliser un point plus ancien pour une différence de temps plus significative
    // const timeDiff = lastMove.time - prevMove.time;
    // if (timeDiff === 0) {
    //   return; // Ne pas procéder si le temps n'a toujours pas changé
    // }
    // let velocityX = (lastMove.x - prevMove.x) / timeDiff;
    // let velocityY = (lastMove.y - prevMove.y) / timeDiff;
    // // Animation de glissement
    // function animateGlide() {
    //   const vpt = canvas.viewportTransform;
    //   const friction = 0.96; // Réduction de la vitesse à chaque frame
    //   const minVelocity = 0.05; // Vitesse minimale pour arrêter l'animation
    //   vpt[4] += velocityX;
    //   vpt[5] += velocityY;
    //   console.log('vpt', vpt);
    //   canvas.setViewportTransform(vpt);
    //   setViewportTransform([...vpt]);
    //   // Réduire la vélocité
    //   velocityX *= friction;
    //   velocityY *= friction;
    //   if (
    //     Math.abs(velocityX) > minVelocity ||
    //     Math.abs(velocityY) > minVelocity
    //   ) {
    //     requestAnimationFrame(animateGlide);
    //   }
    // }
    // // Commencer l'animation
    // requestAnimationFrame(animateGlide);
    // // Réinitialiser l'historique de glissement
    // canvas.dragHistory = [];
  };

export const handleDocumentKeyDown =
  (canvas: fabric.Canvas) => (evt: { altKey: boolean; code: string }) => {
    if (canvas.objSelected) {
      if (evt.altKey === true || evt.code === 'Space') {
        canvas.setCursor('grab');
        canvas.defaultCursor = 'grab';
      }
    }
  };

export const handleDocumentKeyUp = (canvas: fabric.Canvas) => () => {
  if (canvas.objSelected) {
    canvas.setCursor('default');
    canvas.defaultCursor = 'default';
  }
};
