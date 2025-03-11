/**
 * TODO: Ajouter une animation
 */
import React, { useRef } from 'react';
import SidePanel from '../sidePanel/SidePanel';
import { PagesPanel } from './SidePanel/pagesPanel/PagesPanel';
import { Book } from '@/common/types/book'; // Ajuste le chemin selon ton projet

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null; // Passe le livre pour accéder aux pages dans PagesPanel
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  book,
}) => {
  const pagesPanelRef = useRef<HTMLDivElement>(null);
  const sidePanelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-40 ${
        isOpen ? 'block' : 'hidden'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dans le panneau
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="h-[60vh] overflow-y-auto">
          {/* Panneaux dans le drawer */}
          <div className="flex flex-col h-full">
            <PagesPanel
              ref={pagesPanelRef}
              className="h-1/2 border-b border-primary-200 dark:border-primary-800"
              pages={book?.pages || []}
              addPageButtonClick={() => {}}
            />
            <SidePanel
              ref={sidePanelRef}
              // setSidePanelWidth={() => {}}
              className="relative z-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
