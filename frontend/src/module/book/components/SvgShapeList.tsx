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
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [strokeStyle, setStrokeStyle] = useState<string>('solid');

  useEffect(() => {
    if (!canvas || !selectedObject) {
      setShapes([]);
      setSelectedShapes([]);
      return;
    }

    if (selectedObject.type === 'group') {
      const group = selectedObject as fabric.Group;
      setShapes(group.getObjects());
    } else {
      setShapes([selectedObject]);
    }
  }, [canvas, selectedObject]);

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

  position.left = 0;
  position.top = 40;
  position.right = 40;

  const handleMouseEnter = (shape: fabric.Object) => {
    if (!shape) return;
    if (!shape.get('originalStroke')) {
      shape.set('originalStroke', shape.stroke || null);
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

  const handleShapeSelect = (shape: fabric.Object, event: React.MouseEvent) => {
    event.stopPropagation(); // Empêcher la propagation pour éviter la fermeture
    const isCtrlKey = event.ctrlKey || event.metaKey;
    setSelectedShapes((prev) => {
      if (isCtrlKey) {
        if (prev.includes(shape)) {
          return prev.filter((s) => s !== shape);
        } else {
          return [...prev, shape];
        }
      } else {
        return [shape];
      }
    });

    if (canvas) {
      canvas.discardActiveObject();
      const sel = new fabric.ActiveSelection(selectedShapes, {
        canvas: canvas,
      });
      canvas.setActiveObject(sel);
      canvas.renderAll();
    }
  };

  const handleDeleteSelected = () => {
    if (!canvas || !selectedObject || selectedShapes.length === 0) return;

    selectedShapes.forEach((shape) => {
      if (selectedObject.type === 'group') {
        const group = selectedObject as fabric.Group;
        group.remove(shape);
        if (group.getObjects().length === 0) {
          canvas.remove(group);
        }
      } else {
        canvas.remove(shape);
      }
    });

    setShapes((prev) => prev.filter((s) => !selectedShapes.includes(s)));
    setSelectedShapes([]);
    canvas.renderAll();

    if (shapes.length === selectedShapes.length) {
      onClose();
    }
  };

  const applyStrokeStyle = () => {
    if (!canvas || selectedShapes.length === 0) return;

    selectedShapes.forEach((shape) => {
      shape.set({
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeStyle === 'dashed' ? [5, 5] : undefined,
      });
      shape.set('originalStroke', strokeColor);
    });
    canvas.renderAll();
  };

  return (
    <div
      className="absolute z-20 bg-white dark:bg-primary-900 rounded-xl"
      style={{
        top: position.top,
        right: position.right,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}
      onClick={(e) => e.stopPropagation()} // Assure que les clics à l'intérieur ne ferment pas la boîte
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        X
      </button>
      <h3 className="text-lg font-semibold mb-2">Formes de l'SVG :</h3>
      <div className="p-2">
        <div className="mb-2 flex space-x-2">
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-10 h-8 cursor-pointer"
          />
          <input
            type="number"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value) || 1)}
            min="1"
            max="10"
            className="w-16 p-1 border rounded"
          />
          <select
            value={strokeStyle}
            onChange={(e) => setStrokeStyle(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="solid">Continu</option>
            <option value="dashed">Tiret</option>
          </select>
          <button
            onClick={applyStrokeStyle}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Appliquer
          </button>
        </div>

        <button
          onClick={handleDeleteSelected}
          className="bg-red-500 text-white px-2 py-1 rounded mb-2 hover:bg-red-600"
          disabled={selectedShapes.length === 0}
        >
          Supprimer la sélection ({selectedShapes.length})
        </button>

        <ul
          className="divide-y divide-primary-600 overflow-y-auto"
          style={{ maxHeight: '400px' }}
        >
          {shapes.length > 0 ? (
            shapes.map((shape, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2"
                style={{
                  backgroundColor: selectedShapes.includes(shape)
                    ? 'rgba(0, 123, 255, 0.1)'
                    : 'transparent',
                }}
                onMouseEnter={() => handleMouseEnter(shape)}
                onMouseLeave={() => handleMouseLeave(shape)}
                onClick={(e) => handleShapeSelect(shape, e)}
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
                    // handleDeleteShape(shape);
                    handleDeleteSelected();
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
    </div>
  );
};

export default SvgShapeList;
