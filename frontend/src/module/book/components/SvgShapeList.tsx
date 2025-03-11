import React, { useEffect, useState } from 'react';
import * as fabric from 'fabric';

interface SvgShapeListProps {
  canvas: fabric.Canvas | null;
  selectedObject: fabric.Object | null;
  onClose: () => void;
}

const SvgShapeList: React.FC<SvgShapeListProps> = ({
  canvas,
  selectedObject,
  onClose,
}) => {
  const [shapes, setShapes] = useState<fabric.Object[]>([]);

  useEffect(() => {
    if (!canvas || !selectedObject) {
      setShapes([]);
      return;
    }

    // Vérifier si l'objet sélectionné est un groupe (SVG importé)
    if (selectedObject.type === 'group') {
      const group = selectedObject as fabric.Group;
      setShapes(group.getObjects());
    } else {
      setShapes([selectedObject]);
    }
  }, [canvas, selectedObject]);

  // Calculer la position pour centrer la liste près de l'objet sélectionné
  const getPosition = () => {
    if (!canvas || !selectedObject) return { top: 0, left: 0, right: 0 };
    const canvasRect = canvas.getElement().getBoundingClientRect();
    const objectCenter = selectedObject.getCenterPoint();
    const zoom = canvas.getZoom();
    const left = objectCenter.x * zoom + canvasRect.left + 10;
    const right = objectCenter.x * zoom + canvasRect.left + 10;
    const top = objectCenter.y * zoom + canvasRect.top + 10;
    return { top: `${top}px`, left: `${left}px`, right: `${right}px` };
  };

  const position = getPosition();
  console.log('position', position);

  // Positionnement fixe
  position.left = 0;
  position.top = 40;
  position.right = 40;

  // Gestion du survol pour changer la couleur du tracé
  const handleMouseEnter = (shape: fabric.Object) => {
    if (!shape) return;

    // Sauvegarder la couleur d'origine (si ce n'est pas déjà fait)
    if (!shape.get('originalStroke')) {
      shape.set('originalStroke', shape.stroke || 'black'); // Par défaut à 'black' si stroke est null
    }

    // Changer la couleur du tracé en rouge
    shape.set('stroke', 'red');
    canvas?.renderAll();
  };

  const handleMouseLeave = (shape: fabric.Object) => {
    if (!shape) return;

    // Restaurer la couleur d'origine
    const originalStroke =
      shape.get('originalStroke') || shape.stroke || 'black';
    shape.set('stroke', originalStroke);
    canvas?.renderAll();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: position.top,
        right: position.right,
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          cursor: 'pointer',
        }}
      >
        X
      </button>
      <h3 style={{ margin: '0 0 10px 0' }}>Formes de l'SVG :</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {shapes.length > 0 ? (
          shapes.map((shape, index) => (
            <li
              key={index}
              style={{
                padding: '5px 0',
                borderBottom: '1px solid #eee',
                cursor: 'pointer', // Indiquer que l'élément est interactif
              }}
              onMouseEnter={() => handleMouseEnter(shape)}
              onMouseLeave={() => handleMouseLeave(shape)}
            >
              {shape.type} (ID: {shape.get('id') || 'N/A'})
              <br />
              <small>
                Coordonnées : ({Math.round(shape.left || 0)},{' '}
                {Math.round(shape.top || 0)})
              </small>
            </li>
          ))
        ) : (
          <li>Aucune forme détectée</li>
        )}
      </ul>
    </div>
  );
};

export default SvgShapeList;
