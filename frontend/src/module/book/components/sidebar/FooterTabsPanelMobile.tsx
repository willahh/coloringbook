import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { TabsConfig, TabType } from './TabsConfig';

interface FooterTabsPanelMobileProps {
  className?: string;
}

const FooterTabsPanelMobile: React.FC<FooterTabsPanelMobileProps> = ({
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Illustrations);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, setLastDragPosition] = useState<number>(0); // Sauvegarde de la dernière position y
  const panelRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: TabType) => {
    if (activeTab === tabId && isOpen) {
      setIsOpen(false);
      // setActiveTab(null);
    } else {
      setActiveTab(tabId);
      setIsOpen(true);
    }
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

  // Gestion de la fin du drag avec sauvegarde de la position
  const handleDragEnd = (_event: unknown, info: { offset: { y: number } }) => {
    const panelHeight = panelRef.current?.clientHeight || 0;
    const dragDistance = info.offset.y;
    const threshold = panelHeight * 0.5; // Seuil de 30% pour une fermeture rapide

    if (dragDistance > threshold) {
      // Fermeture rapide si glissé vers le bas au-delà du seuil
      setIsOpen(false);
      // setActiveTab(null);
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
  const handleDrag = (event: unknown, info: { point: { y: number } }) => {
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
        className="absolute bottom-0 w-full z-30 border-t  overflow-x-auto snap-x
       border-primary-200 dark:border-primary-800 bg-primary-100 dark:bg-primary-950"
      >
        <div className="flex">
          {TabsConfig.map((tab) => (
            <button
              key={tab.id}
              className={`flex flex-col items-center snap-center px-4 py-4 text-sm font-normal transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-secondary-500'
                  : 'text-primary-500 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-300'
              }`}
              onClick={() => handleTabClick(tab.id)}
              aria-expanded={activeTab === tab.id && isOpen}
              aria-controls={`panel-${tab.id}`}
            >
              <span className="mb-1 flex items-end justify-center">
                {tab.icon}
              </span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panneau animé avec drag-and-drop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            {/* <motion.div
              className="fixed z-10 inset-0 bg-primary-100/75 dark:bg-primary-950/75"
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
              className="fixed bottom-0 w-full overflow-hidden z-20 bg-primary-100 border-t border-primary-300 dark:bg-primary-950 dark:border-primary-800 rounded-tl-3xl rounded-tr-3xl shadow-2xl"
              // style={{ height: 'calc(min(400px, 70vh))' }}
              style={{ height: '70vh' }}
            >
              {/* En-tête du panneau avec une zone de drag */}
              <div
                className="flex justify-center items-center p-2 border-b border-primary-200 dark:border-primary-800 cursor-grab"
                style={{ touchAction: 'none' }} // Empêcher le scroll par défaut
              >
                <div className="w-12 h-1 bg-primary-400 rounded-full" />
              </div>
              <div className="flex-1 p-4 overflow-auto h-full">
                {TabsConfig.find((tab) => tab.id === activeTab)?.content}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FooterTabsPanelMobile;
