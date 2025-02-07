import React, { useState, useEffect, useCallback, useContext } from 'react';
// import { useDrag } from 'react-dnd';
import axios from 'axios';
import { getAPIURL, getMediaUrl } from '@/utils/api';
// import { ElementService } from '@/services/ElementService';
// import { Obj } from '@/domain/book';
import { GraphicAsset } from '@/types/graphic-asset.entity';
// interface GraphicAsset {
//   id: number;
//   name: string;
//   type: string;
//   path: string;
//   fullPath: string;
//   vecPath: string;
// }
import { BookContext } from '../../book.context';

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
      className="flex flex-col items-center p-2 border border-primary-200 dark:border-primary-700 rounded cursor-pointer"
      onClick={() => onClick(asset)}
      // style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100">
        {asset.type === 'svg' && (
          <img
            src={`${getMediaUrl()}/${asset.path}`}
            alt={asset.name}
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <div>
        <div>{asset.type}</div>
        <span className="mt-2 text-xs text-center">{asset.name}</span>
      </div>
    </div>
  );
};
// TODO: add graphics into a state chunk
const GraphicsPanel: React.FC<{
  onGraphicAssetItemClick: (asset: GraphicAsset) => void;
}> = ({ onGraphicAssetItemClick }) => {
  const { refreshGraphics } = useContext(BookContext);
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
  }, [refreshGraphics]);

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

  return (
    <div className="p-4">
      <h2 className="text-black dark:text-white text-lg mb-4">GraphicsPanel</h2>
      <div className="grid grid-cols-2 gap-4">
        {graphicAssets.map((asset) => (
          <GraphicAssetItem
            key={asset.id}
            asset={asset}
            onClick={onGraphicAssetItemClick}
          />
        ))}
        <div
          className="flex items-center justify-center border border-dashed border-gray-500 dark:border-gray-500 rounded cursor-pointer"
          onClick={() =>
            addGraphicAsset({
              name: 'New Graphic',
              // type: 'svg',
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
