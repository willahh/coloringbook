import { GraphicAsset } from '@/types/graphic-asset.entity';
import { useAppDispatch, useAppSelector } from '@/common/hooks/useRedux';
import { selectAllGraphicAssets } from './graphicAssets.state';
import { useEffect } from 'react';
import * as graphicAssetsAction from './graphicAssets.actions';
import { Tooltip } from '@/components/Tooltip';

const Item: React.FC<{ graphicAsset: GraphicAsset }> = ({ graphicAsset }) => (
  <div data-name="item" className="transition-all">
    <img src="/assets/papier/animaux.jpg" alt="" className=" rounded-lg " />
    <Tooltip content={graphicAsset.name}>
      <div className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
        {graphicAsset.name}
      </div>
    </Tooltip>
    <div className="text-xs bg-secondary-500 p-1 inline rounded-xs text-secondary-900 cursor-default select-none">
      {graphicAsset.type}
    </div>
  </div>
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
              className="grid grid-cols-1 @xs:grid-cols-4 gap-4"
            >
              {graphicAssets.map((graphicAsset) => {
                return <Item graphicAsset={graphicAsset} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphicAssets;
