import React, { useState } from 'react';
import {
  FaImages,
  FaShapes,
  FaFont,
  FaPencilAlt,
  FaUpload,
} from 'react-icons/fa'; // Font Awesome icons
import { IoColorPalette } from 'react-icons/io5'; // Ionicon for "Colorier"

// Interface for tab props
interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface FooterTabsPanelMobileProps {
  className: string;
}

const FooterTabsPanelMobile: React.FC<FooterTabsPanelMobileProps> = ({
  className,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Formes');

  const tabs: Tab[] = [
    {
      id: 'Illustrations',
      label: 'Illustrations',
      icon: <FaImages className="inline-block mr-2" />, // Icon for Illustrations
      content: <IllustrationsPanel />,
    },
    {
      id: 'Elements',
      label: 'Elements',
      icon: <FaShapes className="inline-block mr-2" />, // Icon for Elements
      content: <ShapesPanel />,
    },
    {
      id: 'Textes',
      label: 'Textes',
      icon: <FaFont className="inline-block mr-2" />, // Icon for Textes
      content: <ShapesPanel />,
    },
    {
      id: 'Formes',
      label: 'Formes',
      icon: <FaShapes className="inline-block mr-2" />, // Icon for Formes
      content: <ShapesPanel />,
    },
    {
      id: 'Dessiner',
      label: 'Dessiner',
      icon: <FaPencilAlt className="inline-block mr-2" />, // Icon for Dessiner
      content: <ShapesPanel />,
    },
    {
      id: 'Colorier',
      label: 'Colorier',
      icon: <IoColorPalette className="inline-block mr-2" />, // Icon for Colorier
      content: <ShapesPanel />,
    },
    {
      id: 'Importer',
      label: 'Importer',
      icon: <FaUpload className="inline-block mr-2" />, // Icon for Importer
      content: <ShapesPanel />,
    },
  ];

  return (
    <div
      data-id="footer-tabs-panel-mobile"
      className={`${className} flex-col w-full flex overflow-hidden 
      rounded-tl-3xl rounded-tr-3xl bg-gray-100 dark:bg-gray-900`}
    >
      {/* Tab Bar */}
      <div className="flex overflow-x-auto snap-x border-t border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center snap-center p-4 text-sm font-normal ${
              activeTab === tab.id
                ? 'text-secondary-500 '
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 p-4 overflow-auto">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// Dummy Panel Components (replace with actual content)
const ShapesPanel: React.FC = () => (
  <div className="text-gray-800 dark:text-gray-200">
    <h3 className="text-lg font-semibold">Formes</h3>
    <p>Contenu pour les formes (ex. carrés, cercles, triangles).</p>
    {/* Add your shapes content here */}
  </div>
);

const IllustrationsPanel: React.FC = () => (
  <div className="text-gray-800 dark:text-gray-200">
    <h3 className="text-lg font-semibold">Illustrations</h3>
    <p>Contenu pour les illustrations (ex. animaux, objets).</p>
    {/* Add your illustrations content here */}
  </div>
);

export default FooterTabsPanelMobile;
