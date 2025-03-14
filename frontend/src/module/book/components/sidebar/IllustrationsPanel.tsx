import AssetList from "./AssetList";

const IllustrationsPanel: React.FC = () => (
  <div className="text-gray-800 dark:text-gray-200">
    <h3 className="text-lg font-semibold">Illustrations</h3>
    <h4>Animeaux</h4>
    <div>dssd</div>
    
    <h4>Nature</h4>
    <div>dssd</div>
    
    <h4>Objets</h4>
    {/* <p>Contenu pour les illustrations (ex. animaux, objets).</p> */}
    <AssetList title="Illustrations"/>

    <h3>Formes</h3>
  </div>
);

export default IllustrationsPanel;
