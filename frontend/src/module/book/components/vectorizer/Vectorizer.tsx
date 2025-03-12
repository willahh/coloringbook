import React, { useState, useEffect } from 'react';
import { potrace } from 'esm-potrace-wasm';
import { optimize } from 'svgo';
import { FaSpinner, FaRotate } from 'react-icons/fa6';

interface VectorizerProps {
  imageSrc: string | null;
  setSvgOutput: React.Dispatch<React.SetStateAction<string | null>>;
}

const Vectorizer: React.FC<VectorizerProps> = ({ imageSrc, setSvgOutput }) => {
  const [threshold, setThreshold] = useState<number>(128); // Seuil de détection
  const [turdSize, setTurdSize] = useState<number>(50); // Supprimer les taches
  const [alphaMax, setAlphaMax] = useState<number>(1.0); // AlphaMax (0.0 à 1.3334)
  const [optiCurve, setOptiCurve] = useState<boolean>(true); // OptiCurve (booléen)
  const [optTolerance, setOptTolerance] = useState<number>(0.2); // OptTolerance (0.0 à 1.0)
  const [turnPolicy, setTurnPolicy] = useState<number>(4); // TurnPolicy (0 à 6)
  const [svgOutput, setSvgOutputLocal] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // État pour le loader
  const [rotation, setRotation] = useState<number>(0); // Angle de rotation (0°, 90°, 180°, 270°)

  useEffect(() => {
    if (!imageSrc) return;

    const vectorizeImage = async () => {
      setIsProcessing(true); // Activer le loader
      try {
        // Charger l'image dans un canvas
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
        await new Promise((resolve) => (img.onload = resolve));

        // Redimensionner l'image pour éviter les problèmes de mémoire
        const maxWidth = 500; // Limite de largeur
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Impossible de créer le contexte 2D');

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Conversion en niveaux de gris pour améliorer le monochrome
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = gray; // Rouge
          data[i + 1] = gray; // Vert
          data[i + 2] = gray; // Bleu
          data[i + 3] = data[i + 3]; // Alpha inchangé
        }
        ctx.putImageData(imageData, 0, 0);

        console.log('Canvas dimensions:', canvas.width, canvas.height); // Débogage
        console.log('ImageData length:', data.length); // Débogage

        // Vectorisation avec esm-potrace-wasm
        const svg = await potrace(imageData, {
          threshold,
          extractcolors: false, // Mode monochrome
          turdSize,
          alphamax: alphaMax,
          opticurve: optiCurve ? 1 : 0,
          opttolerance: optTolerance,
          turnpolicy: turnPolicy,
        });

        // Optimisation avec SVGO
        const optimizedSvg = optimize(svg, {
          multipass: true,
          plugins: [{ name: 'preset-default' }, { name: 'removeDimensions' }],
        }).data;

        setSvgOutputLocal(optimizedSvg);
        setSvgOutput(optimizedSvg);
      } catch (error) {
        console.error('Erreur lors de la vectorisation :', error);
      } finally {
        setIsProcessing(false); // Désactiver le loader une fois terminé
      }
    };

    // Déclencher la vectorisation avec un léger délai
    const debounceTimer = setTimeout(vectorizeImage, 300);
    return () => clearTimeout(debounceTimer);
  }, [
    imageSrc,
    threshold,
    turdSize,
    alphaMax,
    optiCurve,
    optTolerance,
    turnPolicy,
    setSvgOutput,
  ]);

  // Fonction pour incrémenter la rotation de 90 degrés
  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[500px] gap-4">
      {/* Colonne gauche : Curseurs */}
      <div className="w-full md:w-1/2 p-4 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
          Options de vectorisation (Monochrome)
        </h3>
        <div className="mt-2 space-y-4">
          {/* Options SVG */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Options SVG
            </h4>
            <div className="mt-2 space-y-2">
              {/* Seuil de détection */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Seuil de détection (0-255) :
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full"
                />
                <span>{threshold}</span>
              </label>

              {/* Supprimer les taches */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Supprimer les taches (0-50 pixels) :
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={turdSize}
                  onChange={(e) => setTurdSize(Number(e.target.value))}
                  className="w-full"
                />
                <span>{turdSize}</span>
              </label>

              {/* AlphaMax */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                AlphaMax (0.0-1.3334) :
                <input
                  type="range"
                  min="0.0"
                  max="1.3334"
                  step="0.01"
                  value={alphaMax}
                  onChange={(e) => setAlphaMax(Number(e.target.value))}
                  className="w-full"
                />
                <span>{alphaMax.toFixed(2)}</span>
              </label>

              {/* OptiCurve */}
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={optiCurve}
                  onChange={(e) => setOptiCurve(e.target.checked)}
                  className="form-checkbox text-secondary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Optimiser les courbes
                </span>
              </label>

              {/* OptTolerance */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                OptTolerance (0.0-1.0) :
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.01"
                  value={optTolerance}
                  onChange={(e) => setOptTolerance(Number(e.target.value))}
                  className="w-full"
                />
                <span>{optTolerance.toFixed(2)}</span>
              </label>

              {/* TurnPolicy */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                TurnPolicy (0-6) :
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={turnPolicy}
                  onChange={(e) => setTurnPolicy(Number(e.target.value))}
                  className="w-full"
                />
                <span>{turnPolicy}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite : Aperçu et rotation */}
      <div className="w-full md:w-1/2 p-4 bg-white dark:bg-white flex flex-col items-center justify-center">
        {isProcessing && (
          <div className="flex items-center justify-center">
            <FaSpinner
              className="animate-spin text-gray-500 dark:text-gray-400"
              size={24}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Traitement en cours...
            </span>
          </div>
        )}

        {!isProcessing && !svgOutput && (
          <div className="text-gray-500 dark:text-gray-400">
            Aucun aperçu disponible. Veuillez charger une image.
          </div>
        )}

        {svgOutput && !isProcessing && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div
              className="w-full h-auto flex items-center justify-center"
              style={{
                transform: `rotate(${rotation}deg)`,
                maxWidth: '100%',
                maxHeight: '400px',
                overflow: 'visible',
              }}
              dangerouslySetInnerHTML={{ __html: svgOutput }}
            />
            <button
              onClick={handleRotate}
              disabled={isProcessing}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <FaRotate className="mr-2" />
              Rotater (90°)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vectorizer;