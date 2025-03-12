import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaImages,
  FaShapes,
  FaFont,
  FaPencilAlt,
  FaUpload,
} from 'react-icons/fa';
import { IoColorPalette } from 'react-icons/io5';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface FooterTabsPanelMobileProps {
  className?: string;
}

const FooterTabsPanelMobile: React.FC<FooterTabsPanelMobileProps> = ({
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [lastDragPosition, setLastDragPosition] = useState<number>(0); // Sauvegarde de la dernière position y
  const panelRef = useRef<HTMLDivElement>(null);

  const tabs: Tab[] = [
    {
      id: 'Illustrations',
      label: 'Illustrations',
      icon: <FaImages className="inline-block mr-2" />,
      content: <IllustrationsPanel />,
    },
    {
      id: 'Elements',
      label: 'Elements',
      icon: <FaShapes className="inline-block mr-2" />,
      content: <ShapesPanel />,
    },
    {
      id: 'Textes',
      label: 'Textes',
      icon: <FaFont className="inline-block mr-2" />,
      content: <ShapesPanel />,
    },
    {
      id: 'Formes',
      label: 'Formes',
      icon: <FaShapes className="inline-block mr-2" />,
      content: <ShapesPanel />,
    },
    {
      id: 'Dessiner',
      label: 'Dessiner',
      icon: <FaPencilAlt className="inline-block mr-2" />,
      content: <ShapesPanel />,
    },
    {
      id: 'Colorier',
      label: 'Colorier',
      icon: <IoColorPalette className="inline-block mr-2" />,
      content: <ShapesPanel />,
    },
    {
      id: 'Importer',
      label: 'Importer',
      icon: <FaUpload className="inline-block mr-2" />,
      content: <ShapesPanel />,
    },
  ];

  const handleTabClick = (tabId: string) => {
    if (activeTab === tabId && isOpen) {
      setIsOpen(false);
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
      setIsOpen(true);
    }
  };

  const onOverlayClick = () => {
    setIsOpen(false);
    setActiveTab(null);
  };

  // Animation pour le panneau avec position sauvegardée
  const panelVariants = {
    closed: {
      y: '100%', // Panneau hors écran (en bas)
    },
    open: (custom: number) => ({
      y: custom || 0, // Position initiale basée sur lastDragPosition ou 0 par défaut
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 50,
        bounce: 0.1,
      },
    }),
  };

  // const overlayVariants = {
  //   hidden: { opacity: 0 },
  //   visible: { opacity: 1 },
  //   exit: { opacity: 0, transition: { duration: 0.2 } },
  // };

  // Gestion de la fin du drag avec sauvegarde de la position
  const handleDragEnd = (event: any, info: any) => {
    const panelHeight = panelRef.current?.clientHeight || 0;
    const dragDistance = info.offset.y;
    const threshold = panelHeight * 0.5; // Seuil de 30% pour une fermeture rapide

    if (dragDistance > threshold) {
      // Fermeture rapide si glissé vers le bas au-delà du seuil
      setIsOpen(false);
      setActiveTab(null);
    } else if (dragDistance < -threshold) {
      // Ouverture complète si glissé vers le haut au-delà du seuil
      setIsOpen(true);
    } else {
      // Sauvegarde de la position actuelle si entre les seuils
      // setLastDragPosition(info.point.y - (window.innerHeight - panelHeight));
      // setIsOpen(!!activeTab);
    }
  };

  // Mise à jour de la position en temps réel pendant le drag
  const handleDrag = (event: any, info: any) => {
    const panelHeight = panelRef.current?.clientHeight || 0;
    const newPosition = info.point.y - (window.innerHeight - panelHeight);
    if (newPosition >= 0 && newPosition <= panelHeight) {
      setLastDragPosition(newPosition);
    }
  };

  return (
    <div
      data-id="footer-tabs-panel-mobile"
      className={`${className} fixed bottom-0 left-0 w-full z-30`}
    >
      {/* Barre des onglets (toujours visible en bas) */}
      <div
        className="absolute bottom-0 z-30 flex overflow-x-auto snap-x border-t
       border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center snap-center p-4 text-sm font-normal ${
              activeTab === tab.id
                ? 'text-secondary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => handleTabClick(tab.id)}
            aria-expanded={activeTab === tab.id && isOpen}
            aria-controls={`panel-${tab.id}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panneau animé avec drag-and-drop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            {/* <motion.div
              className="fixed z-10 inset-0 bg-primary-100/75 dark:bg-primary-900/75"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onOverlayClick}
            /> */}

            {/* Panneau */}
            <motion.div
              ref={panelRef}
              key="panel"
              initial="closed"
              animate="open"
              exit="closed"
              variants={panelVariants}
              // custom={lastDragPosition} // Passer la dernière position comme custom value
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 50,
                bounce: 0.1,
              }}
              drag="y" // Activer le drag vertical
              dragConstraints={{ top: 0, bottom: window.innerHeight }} // Limiter le drag
              dragElastic={0.2} // Résistance élastique
              dragMomentum={true} // Activer l'inertie après le drag
              onDrag={handleDrag} // Mettre à jour la position en temps réel
              onDragEnd={handleDragEnd} // Gérer la fin du drag
              className="fixed bottom-0 w-full overflow-hidden z-20 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-tl-3xl rounded-tr-3xl"
              style={{ height: 'calc(min(400px, 70vh))' }}
            >
              {/* En-tête du panneau avec une zone de drag */}
              <div
                className="flex justify-center items-center p-2 border-b border-gray-200 dark:border-gray-700 cursor-grab"
                style={{ touchAction: 'none' }} // Empêcher le scroll par défaut
              >
                <div className="w-12 h-1 bg-gray-400 rounded-full" />
              </div>
              <div className="flex-1 p-4 overflow-auto h-full">
                {tabs.find((tab) => tab.id === activeTab)?.content}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composants temporaires pour le contenu des onglets
const ShapesPanel: React.FC = () => (
  <div className="text-gray-800 dark:text-gray-200">
    <h3 className="text-lg font-semibold">Formes</h3>
    <p>Contenu pour les formes (ex. carrés, cercles, triangles).</p>
  </div>
);

const IllustrationsPanel: React.FC = () => (
  <div className="text-gray-800 dark:text-gray-200">
    <h3 className="text-lg font-semibold">Illustrations</h3>
    <p>Contenu pour les illustrations (ex. animaux, objets).</p>
  </div>
);

export default FooterTabsPanelMobile;
