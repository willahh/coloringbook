import React, { useState } from 'react';
import * as fabric from 'fabric';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  objects: fabric.Object[];
  children?: Layer[];
}

interface LayerPanelProps {
  canvas: fabric.Canvas | null;
  onUpdateCanvas: () => void; // Pour rafraîchir le canvas après modification
}

const LayerPanel: React.FC<LayerPanelProps> = ({ canvas, onUpdateCanvas }) => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'layer1',
      name: 'Calque 1',
      visible: true,
      locked: false,
      objects: [],
      children: [
        {
          id: 'sublayer1',
          name: 'Sous-calque 1',
          visible: true,
          locked: false,
          objects: [],
        },
        {
          id: 'sublayer2',
          name: 'Sous-calque 2',
          visible: true,
          locked: false,
          objects: [],
        },
      ],
    },
    {
      id: 'layer2',
      name: 'Calque 2',
      visible: true,
      locked: false,
      objects: [],
    },
  ]);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(
    new Set(['layer1'])
  );

  const toggleLayerVisibility = (id: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        updateLayerVisibility(layer, id, !getLayerVisibility(layer, id))
      )
    );
    onUpdateCanvas();
  };

  const toggleLayerLock = (id: string) => {
    setLayers((prev) =>
      prev.map((layer) => updateLayerLock(layer, id, !getLayerLock(layer, id)))
    );
    onUpdateCanvas();
  };

  const toggleExpand = (id: string) => {
    setExpandedLayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const deleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    onUpdateCanvas();
  };

  const getLayerVisibility = (layer: Layer, targetId: string): boolean => {
    if (layer.id === targetId) return layer.visible;
    if (layer.children) {
      return layer.children.some((child) =>
        getLayerVisibility(child, targetId)
      );
    }
    return false;
  };

  const getLayerLock = (layer: Layer, targetId: string): boolean => {
    if (layer.id === targetId) return layer.locked;
    if (layer.children) {
      return layer.children.some((child) => getLayerLock(child, targetId));
    }
    return false;
  };

  const updateLayerVisibility = (
    layer: Layer,
    targetId: string,
    value: boolean
  ): Layer => {
    if (layer.id === targetId) return { ...layer, visible: value };
    if (layer.children) {
      return {
        ...layer,
        children: layer.children.map((child) =>
          updateLayerVisibility(child, targetId, value)
        ),
      };
    }
    return layer;
  };

  const updateLayerLock = (
    layer: Layer,
    targetId: string,
    value: boolean
  ): Layer => {
    if (layer.id === targetId) return { ...layer, locked: value };
    if (layer.children) {
      return {
        ...layer,
        children: layer.children.map((child) =>
          updateLayerLock(child, targetId, value)
        ),
      };
    }
    return layer;
  };

  const renderLayer = (layer: Layer, depth = 0) => (
    <div
      data-id="layer-panel"
      key={layer.id}
      className="ml-4"
      style={{ marginLeft: `${depth * 16}px` }}
    >
      <div className="flex items-center justify-between p-1 hover:bg-gray-100">
        <div className="flex items-center space-x-2">
          {layer.children && (
            <button
              onClick={() => toggleExpand(layer.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              {expandedLayers.has(layer.id) ? '▼' : '▶'}
            </button>
          )}
          <input
            type="checkbox"
            checked={layer.visible}
            onChange={() => toggleLayerVisibility(layer.id)}
            className="mr-2"
          />
          <span>{layer.name}</span>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => toggleLayerLock(layer.id)}
            className="text-gray-500 hover:text-gray-700"
          >
            {layer.locked ? '🔒' : '🔓'}
          </button>
          <button
            onClick={() => deleteLayer(layer.id)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      </div>
      {layer.children && expandedLayers.has(layer.id) && (
        <div>
          {layer.children.map((child) => renderLayer(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-64 bg-white dark:bg-primary-900 border-r border-primary-200 dark:border-primary-800 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold p-2 border-b">Calques</h3>
      {layers.map((layer) => renderLayer(layer))}
    </div>
  );
};

export default LayerPanel;
