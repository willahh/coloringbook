import React, { useState, useEffect, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import axios from 'axios';
import { getAPIURL, getMediaUrl } from '@/utils/api';

interface GraphicAsset {
  id: number;
  name: string;
  type: string;
  path: string;
}

// Composant pour chaque élément graphique
const GraphicAssetItem: React.FC<{
  asset: GraphicAsset;
  onClick: (asset: GraphicAsset) => void;
}> = ({ asset, onClick }) => {
  // const [{ isDragging, drag }] = useDrag(() => ({
  //   type: 'GRAPHIC_ASSET',
  //   item: { id: asset.id, path: asset.path },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // }));

  return (
    <div
      // ref={drag}
      className="flex flex-col items-center p-2 border border-gray-200 rounded cursor-move"
      onClick={() => onClick(asset)}
      // style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100">
        {asset.type === 'svg' ? (
          <img
            src={`${getMediaUrl()}/${asset.path}`}
            alt={asset.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div>{asset.type}</div>
        )}
      </div>
      <span className="mt-2 text-xs text-center">{asset.name}</span>
    </div>
  );
};

const GraphicsPanel: React.FC = () => {
  const [graphicAssets, setGraphicAssets] = useState<GraphicAsset[]>([]);

  useEffect(() => {
    const fetchGraphicAssets = async () => {
      try {
        const response = await axios.get(getAPIURL() + '/graphic-assets');
        setGraphicAssets(response.data);
      } catch (error) {
        console.error('Error fetching graphic assets:', error);
      }
    };

    fetchGraphicAssets();
  }, []);

  const addGraphicAsset = useCallback(
    async (newAsset: Partial<GraphicAsset>) => {
      try {
        const response = await axios.post('/api/graphic-assets', newAsset);
        setGraphicAssets((prevAssets) => [...prevAssets, response.data]);
      } catch (error) {
        console.error('Error adding graphic asset:', error);
      }
    },
    []
  );

  const handleClick = (asset: GraphicAsset) => {
    console.log('Asset added to the page:', asset);
    // Ici, vous pourriez appeler une fonction de votre contexte ou état global pour ajouter l'élément à la page
  };

  return (
    <div className="bg-primary-100 dark:bg-primary-900 p-4 w-80">
      <h2 className="text-black dark:text-white text-lg mb-4">GraphicsPanel</h2>
      <div className="grid grid-cols-3 gap-4">
        {graphicAssets.map((asset) => (
          <GraphicAssetItem
            key={asset.id}
            asset={asset}
            onClick={handleClick}
          />
        ))}
        <div
          className="flex items-center justify-center border border-dashed border-gray-500 dark:border-gray-500 rounded cursor-pointer"
          onClick={() =>
            addGraphicAsset({
              name: 'New Graphic',
              type: 'svg',
              path: '/path/to/new/graphic.svg',
            })
          }
        >
          <span className="text-black dark:text-white">+</span>
        </div>
      </div>
    </div>
  );
};

export default GraphicsPanel;
