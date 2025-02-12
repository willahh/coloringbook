import { GraphicAsset } from '@/types/graphic-asset.entity';
import { useAppDispatch, useAppSelector } from '@/common/hooks/useRedux';
import { selectAllGraphicAssets } from './GraphicAssets.slice';
import { useEffect } from 'react';
import * as graphicAssetsAction from './GraphicAssets.actions';
import { Tooltip } from '@/components/Tooltip';

const Item: React.FC<{ graphicAsset: GraphicAsset }> = ({ graphicAsset }) => (
  <button data-name="item" className="transition-all group focus:outline-0">
    <img
      src="/assets/papier/animaux.jpg"
      alt=""
      className={`rounded-lg border-2 border-primary-500
        group-hover:border-secondary-500
        group-focus:border-secondary-500`}
    />
    <Tooltip content={graphicAsset.name}>
      <div
        className={`text-xs overflow-hidden text-ellipsis whitespace-nowrap text-primary-800 dark:text-primary-200
            group-hover:text-black dark:group-hover:text-white 
            group-focus:text-black dark:group-focus:text-white
        `}
      >
        {graphicAsset.name}
      </div>
    </Tooltip>
    {/* <div className="text-xs bg-secondary-500 p-1 inline rounded-xs text-secondary-900 cursor-default select-none">
      {graphicAsset.type}
    </div> */}
  </button>
);

const GraphicAssets: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    graphicAssets: { graphicAssets },
  } = useAppSelector(selectAllGraphicAssets);

  useEffect(() => {
    dispatch(graphicAssetsAction.fetchGraphicAssetsAction());
  }, [dispatch]);

  return (
    <div className="scroll-auto">
      <h2>Eléments graphiques</h2>
      <div data-name="categories">
        <div data-name="category">
          <div className="font-light text-xl">Animaux</div>
          <div className="@container">
            <div
              data-name="items"
              className="grid grid-cols-1 @3xs:grid-cols-4 gap-6"
            >
              {graphicAssets.map((graphicAsset, i) => {
                return (
                  <Item key={`ga-item-${i}`} graphicAsset={graphicAsset} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphicAssets;
