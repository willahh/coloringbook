import React from 'react';

const VectorizerExportButton: React.FC<{ svgOutput: string | null }> = ({ svgOutput }) => {
  const handleExport = () => {
    if (!svgOutput) return;

    // Créer un Blob à partir du SVG
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    // Créer un lien de téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image-vectorisée.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button className="btn" onClick={handleExport} disabled={!svgOutput}>
      Exporter en SVG
    </button>
  );
};

export default VectorizerExportButton;
