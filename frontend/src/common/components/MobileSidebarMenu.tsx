import React from 'react';

interface MobileSidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebarMenu: React.FC<MobileSidebarMenuProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 ${
        isOpen ? 'block' : 'hidden'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dans le menu
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
        <div className="p-4 overflow-y-auto h-full">
          {/* Contenu du menu burger */}
          <ul className="space-y-4">
            <li>
              <a
                href="/library"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Bibliothèque
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Paramètres
              </a>
            </li>
            <li>
              <a
                href="/help"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Aide
              </a>
            </li>
            {/* Ajoute d’autres éléments de menu selon tes besoins */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebarMenu;
