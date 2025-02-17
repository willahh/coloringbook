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

export const handleMouseWheel =
  (
    canvas: fabric.Canvas,
    setViewportTransform: React.Dispatch<React.SetStateAction<fabric.TMat2D>>
  ) =>
  (opt: fabric.TEvent<WheelEvent>) => {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    const zoomMin = 0.75;
    const zoomMax = 5;
    zoom *= 0.998 ** delta;
    console.log('zoom', zoom);
    if (zoom > zoomMax) zoom = zoomMax;
    if (zoom < zoomMin) zoom = zoomMin;
    canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);

    setViewportTransform([...canvas.viewportTransform]);

    opt.e.preventDefault();
    opt.e.stopPropagation();
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
  };

export const handleMouseMove =
  (canvas: fabric.Canvas) => (opt: fabric.TPointerEventInfo) => {
    if (canvas.isDragging) {
      const e = opt.e;
      const vpt = canvas.viewportTransform;
      let clientX: number, clientY: number;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return; // Si ce n'est ni un MouseEvent ni un TouchEvent, on sort
      }

      // Calculer le déplacement
      const moveX = clientX - (canvas.lastPosX ?? 0);
      const moveY = clientY - (canvas.lastPosY ?? 0);

      // Mettre à jour la position
      vpt[4] += moveX;
      vpt[5] += moveY;

      // Garder une trace des mouvements récents pour calculer la vélocité
      if (!canvas.dragHistory) {
        canvas.dragHistory = [];
      }
      canvas.dragHistory.push({ time: Date.now(), x: clientX, y: clientY });

      // Garder seulement les 10 dernières positions pour éviter une surcharge de mémoire
      if (canvas.dragHistory.length > 10) {
        canvas.dragHistory.shift();
      }

      canvas.lastPosX = clientX;
      canvas.lastPosY = clientY;
      canvas.requestRenderAll();
    }
  };

// Nouvelle fonction handleMouseUp avec animation de glissement
// Nouvelle fonction handleMouseUp avec animation de glissement
export const handleMouseUp =
  (
    canvas: fabric.Canvas,
    setViewportTransform: React.Dispatch<React.SetStateAction<fabric.TMat2D>>
  ) =>
  () => {
    canvas.setViewportTransform(canvas.viewportTransform);
    setViewportTransform([...canvas.viewportTransform]);
    canvas.isDragging = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';

    const dragHistory = canvas.dragHistory || [];
    if (dragHistory.length < 3) return; // Utiliser au moins 3 points pour la vélocité

    const lastMove = dragHistory[dragHistory.length - 1];
    const prevMove = dragHistory[dragHistory.length - 3]; // Utiliser un point plus ancien pour une différence de temps plus significative
    const timeDiff = lastMove.time - prevMove.time;
    if (timeDiff === 0) {
      console.log('#11 timeDiff === 0');
      return; // Ne pas procéder si le temps n'a toujours pas changé
    }

    let velocityX = (lastMove.x - prevMove.x) / timeDiff;
    let velocityY = (lastMove.y - prevMove.y) / timeDiff;

    // Animation de glissement
    function animateGlide() {
      const vpt = canvas.viewportTransform;
      const friction = 0.96; // Réduction de la vitesse à chaque frame
      const minVelocity = 0.05; // Vitesse minimale pour arrêter l'animation

      vpt[4] += velocityX;
      vpt[5] += velocityY;

      console.log('vpt', vpt);

      canvas.setViewportTransform(vpt);
      setViewportTransform([...vpt]);

      // Réduire la vélocité
      velocityX *= friction;
      velocityY *= friction;

      if (
        Math.abs(velocityX) > minVelocity ||
        Math.abs(velocityY) > minVelocity
      ) {
        requestAnimationFrame(animateGlide);
      }
    }

    // Commencer l'animation
    requestAnimationFrame(animateGlide);

    // Réinitialiser l'historique de glissement
    canvas.dragHistory = [];
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
