import SvgConvertedAssetsList from '../SvgConvertedAssetsList';
import VectorizerDialog from '../vectorizer/VectorizerDialog';

const PersonnelPanel: React.FC = () => (
  <div className="text-gray-800 dark:text-gray-200">
    <div>
      <h3 className="text-lg font-semibold">Personnel</h3>
      <VectorizerDialog />
    </div>

    <SvgConvertedAssetsList />
  </div>
);

export default PersonnelPanel;
