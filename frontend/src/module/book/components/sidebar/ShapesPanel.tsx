import SvgConvertedAssetsList from '../SvgConvertedAssetsList';
import VectorizerDialog from './../vectorizer/VectorizerDialog';

const ShapesPanel: React.FC = () => (
  <div className="text-gray-800 dark:text-gray-200">
    <h3 className="text-lg font-semibold">Formes</h3>
    <p>Contenu pour les formes (ex. carrés, cercles, triangles).</p>

    <VectorizerDialog />
    <SvgConvertedAssetsList />
  </div>
);

export default ShapesPanel;
