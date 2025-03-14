// import { ToolbarButton } from '@/module/book/components/ToolbarButton';
// import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline';
// import GraphicAssets from './../graphicAssets/GraphicAssets';
import SvgConvertedAssetsList from '../../components/SvgConvertedAssetsList';
import VectorizerComponent from '../../components/vectorizer/VectorizerDialog';

const UserContent: React.FC = () => {
  return (
    <div>
      <VectorizerComponent />
      <SvgConvertedAssetsList />

      {/* <div className="absolute top-4 right-4 flex justify-end">
        <ToolbarButton tooltipContent="Fermer">
          <ArrowDownOnSquareStackIcon />
        </ToolbarButton>
      </div>

      <div>
        <div>Personnel</div>
        <div>Charger</div>
        <div>Charge une image, la convertir en tracé</div>
      </div>
      <GraphicAssets /> */}
    </div>
  );
};

export default UserContent;
