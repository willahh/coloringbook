import React, { useState, useEffect, useRef } from 'react';
import { potrace, init } from 'esm-potrace-wasm';
import { optimize } from 'svgo';
import { FaSpinner, FaRotate } from 'react-icons/fa6';
import 'pinch-zoom-element'; // Importer la bibliothèque

interface VectorizerFormProps {
  imageSrc: string | null;
  setSvgOutput: React.Dispatch<React.SetStateAction<string | null>>;
}

const VectorizerForm: React.FC<VectorizerFormProps> = ({
  imageSrc,
  setSvgOutput,
}) => {
  const [threshold, setThreshold] = useState<number>(128); // Seuil de détection
  const [turdSize, setTurdSize] = useState<number>(50); // Supprimer les taches
  const [alphaMax, setAlphaMax] = useState<number>(1.0); // AlphaMax (0.0 à 1.3334)
  const [optiCurve, setOptiCurve] = useState<boolean>(true); // OptiCurve (booléen)
  const [optTolerance, setOptTolerance] = useState<number>(0.2); // OptTolerance (0.0 à 1.0)
  const [turnPolicy, setTurnPolicy] = useState<number>(4); // TurnPolicy (0 à 6)
  const [svgOutput, setSvgOutputLocal] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // État pour le loader
  const [rotation, setRotation] = useState<number>(0); // Angle de rotation (0°, 90°, 180°, 270°)
  const svgRef = useRef<SVGSVGElement>(null); // Référence au SVG pour appliquer les transformations
  const pinchZoomRef = useRef<HTMLElement>(null); // Référence à l'élément pinch-zoom

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
        const maxWidth = 1280; // Limite de largeur, ne pas mettre une valeur trop haute pour éviter des pbs de mem
        const scale = Math.min(1, maxWidth / img.width);
        console.log('scale', scale);
        console.log('maxWidth / img.width', maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Impossible de créer le contexte 2D');

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Conversion en niveaux de gris pour améliorer le monochrome
        // const data = imageData.data;
        // for (let i = 0; i < data.length; i += 4) {
        //   const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        //   data[i] = gray; // Rouge
        //   data[i + 1] = gray; // Vert
        //   data[i + 2] = gray; // Bleu
        //   data[i + 3] = data[i + 3]; // Alpha inchangé
        // }
        ctx.putImageData(imageData, 0, 0);

        // Vectorisation avec esm-potrace-wasm
        const options = {
          // threshold: 0,
          threshold: threshold,
          extractcolors: false, // Mode monochrome
          // turdSize: turdSize, // suppress speckles (tâches) of up to this size (default: 2).
          turdSize: 50, // Noise 0-82
          alphamax: alphaMax, // corner threshold parameter (default: 1).
          opticurve: optiCurve ? 1 : 0, // turn on/off curve optimization (default: true).
          opttolerance: optTolerance,
          turnpolicy: turnPolicy,
        };
        console.log('#s options', options);
        await init();

        const svg = await potrace(imageData, options);

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

  // Gestion des événements pour pinch-zoom
  useEffect(() => {
    const pinchZoomElement = pinchZoomRef.current;
    if (!pinchZoomElement || !svgRef.current) return;

    const handleChange = (event: Event) => {
      const target = event.target as HTMLElement;
      const x = target?.getAttribute('x') || 0;
      const y = target?.getAttribute('y') || 0;
      const scale = target?.getAttribute('scale') || 1;
      console.log('PinchZoom change:', { x, y, scale }); // Débogage
      const transform = `rotate(${rotation}) translate(${x}, ${y}) scale(${scale})`;
      svgRef.current?.setAttribute('transform', transform);
    };

    const handlePointerDown = () => {
      console.log('Pointer down'); // Débogage
      pinchZoomElement.style.cursor = 'grabbing';
    };

    const handlePointerUp = () => {
      console.log('Pointer up'); // Débogage
      pinchZoomElement.style.cursor = '';
    };

    pinchZoomElement.addEventListener('change', handleChange);
    pinchZoomElement.addEventListener('pointerdown', handlePointerDown);
    pinchZoomElement.addEventListener('pointerup', handlePointerUp);

    return () => {
      pinchZoomElement.removeEventListener('change', handleChange);
      pinchZoomElement.removeEventListener('pointerdown', handlePointerDown);
      pinchZoomElement.removeEventListener('pointerup', handlePointerUp);
    };
  }, [svgOutput, rotation]); // Inclure rotation dans les dépendances

  // Fonction pour incrémenter la rotation de 90 degrés
  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  // Fonction pour réinitialiser le pan et zoom
  const resetPanAndZoom = () => {
    if (svgRef.current) {
      svgRef.current.setAttribute('transform', '');
    }
    setRotation(0); // Réinitialiser également la rotation
  };

  console.log(
    '#s render - svgOutput && !isProcessing',
    svgOutput && !isProcessing
  );
  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-[500px] gap-4">
      {/* Colonne gauche : Curseurs */}
      <div className="w-full md:w-1/2 md:max-w-52 p-4 bg-gray-100 dark:bg-gray-800 overflow-y-auto hidden">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
          Options de vectorisation (Monochrome)
        </h3>
        <div className="@container mt-2 space-y-4">
          {/* Options SVG */}
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Options SVG
          </h4>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1 mt-2 space-y-2">
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

      {/* Colonne droite : Aperçu et rotation */}
      <div className="grow md:w-1/2 p-4 bg-white dark:bg-white checkerboard relative">
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
          <div className="w-full h-full">
            <pinch-zoom
              ref={pinchZoomRef}
              className="w-full h-full flex items-center justify-center"
              style={{ touchAction: 'none' }}
            >
              <svg
                ref={svgRef}
                className="w-full h-full"
                key={svgOutput} // Ajouter une clé unique basée sur svgOutput
                dangerouslySetInnerHTML={{ __html: svgOutput }}
              />
            </pinch-zoom>
            {/* <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handleRotate}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <FaRotate className="mr-2" />
                Rotater (90°)
              </button>
              <button
                onClick={resetPanAndZoom}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Réinitialiser
              </button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default VectorizerForm;
