import React, { useEffect, useState } from 'react';
import * as fabric from 'fabric';

interface SvgShapeListProps {
  canvas: fabric.Canvas | null;
  selectedObject: fabric.Object | null;
  onClose: () => void;
  highlightColor?: string;
}

const SvgShapeList: React.FC<SvgShapeListProps> = ({
  canvas,
  selectedObject,
  onClose,
  highlightColor = 'red',
}) => {
  const [shapes, setShapes] = useState<fabric.Object[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<fabric.Object[]>([]);

  useEffect(() => {
    if (!canvas || !selectedObject) {
      setShapes([]);
      setSelectedShapes([]);
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

  // Gestion du survol (uniquement pour stroke)
  const handleMouseEnter = (shape: fabric.Object) => {
    if (!shape) return;
    if (!shape.get('originalStroke')) {
      shape.set('originalStroke', shape.stroke || null); // Ne pas mettre de valeur par défaut
    }
    shape.set('stroke', highlightColor);
    canvas?.renderAll();
  };

  const handleMouseLeave = (shape: fabric.Object) => {
    if (!shape) return;
    const originalStroke = shape.get('originalStroke') || shape.stroke || null;
    shape.set('stroke', originalStroke);
    canvas?.renderAll();
  };

  // Gestion de la sélection multiple dans la liste
  const handleShapeSelect = (shape: fabric.Object) => {
    setSelectedShapes((prev) => {
      if (prev.includes(shape)) {
        return prev.filter((s) => s !== shape);
      } else {
        return [...prev, shape];
      }
    });

    // Synchronisation avec le canvas
    if (canvas) {
      canvas.discardActiveObject();
      const sel = new fabric.ActiveSelection(selectedShapes, {
        canvas: canvas,
      });
      canvas.setActiveObject(sel);
      canvas.renderAll();
    }
  };

  // Suppression d'une forme
  const handleDeleteShape = (shape: fabric.Object) => {
    if (!canvas || !selectedObject) return;

    if (selectedObject.type === 'group') {
      const group = selectedObject as fabric.Group;
      group.remove(shape);
      if (group.getObjects().length === 0) {
        canvas.remove(group);
      }
    } else {
      canvas.remove(shape);
    }

    setShapes((prev) => prev.filter((s) => s !== shape));
    setSelectedShapes((prev) => prev.filter((s) => s !== shape));
    canvas.renderAll();

    if (shapes.length === 1) {
      onClose();
    }
  };

  return (
    <div
      className="absolute z-20 bg-white dark:bg-primary-900 rounded-xl"
      style={{
        top: position.top,
        right: position.right,
        // zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
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
      <h3>Formes de l'SVG :</h3>
      <ul
        className=" divide-primary-600 divide-y-1 overflow-y-auto"
        style={{
          maxHeight: '400px',
        }}
      >
        {shapes.length > 0 ? (
          shapes.map((shape, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 "
              style={{
                backgroundColor: selectedShapes.includes(shape)
                  ? 'rgba(0, 123, 255, 0.1)'
                  : 'transparent',
              }}
              //   style={{
              //     padding: '5px 0',
              //     borderBottom: '1px solid #eee',
              //     cursor: 'pointer',
              //     backgroundColor: selectedShapes.includes(shape)
              //       ? 'rgba(0, 123, 255, 0.1)'
              //       : 'transparent',
              //     display: 'flex',
              //     justifyContent: 'space-between',
              //     alignItems: 'center',
              //   }}
              onMouseEnter={() => handleMouseEnter(shape)}
              onMouseLeave={() => handleMouseLeave(shape)}
              onClick={() => handleShapeSelect(shape)}
              onFocus={() => handleMouseEnter(shape)}
              onBlur={() => handleMouseLeave(shape)}
            >
              <span>
                {shape.type} (ID: {shape.get('id') || 'N/A'})
                <br />
                <small>
                  Coordonnées : ({Math.round(shape.left || 0)},{' '}
                  {Math.round(shape.top || 0)})
                </small>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteShape(shape);
                }}
                className="bg-red-500 text-white rounded px-2 py-1 text-sm cursor-pointer hover:bg-red-600"
                aria-label={`Supprimer la forme ${shape.type} (ID: ${
                  shape.get('id') || 'N/A'
                })`}
              >
                Supprimer
              </button>
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
