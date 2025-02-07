import React, { useState } from 'react';
import {
  ArrowDownOnSquareStackIcon,
  PaintBrushIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';

import TextIcon from '@assets/icons/icon_text.svg?react';
// import SidebarCorner from '@asùsets/sidebar-corner.svg?react';
import SidebarCornerTop from '@assets/sidebar-corner-top.svg?react';
import { ToolbarButton } from '../../ui/ToolbarButton';
import GraphicAssets from './../graphicAssets/GraphicAssets';
import { initialState, Tab } from './../sidepanel.state';

const tabs = [
  { id: Tab.Draw, label: 'Dessin', icon: PaintBrushIcon, active: true },
  { id: Tab.Text, label: 'Texte', icon: TextIcon, active: false },
  { id: Tab.Shape, label: 'Formes', icon: RectangleGroupIcon, active: false },
  {
    id: Tab.Background,
    label: 'Fonds',
    icon: RectangleGroupIcon,
    active: false,
  },
  {
    id: Tab.Load,
    label: 'Charger',
    description: 'Charge une image, la convertir en tracé',
    icon: RectangleGroupIcon,
    active: false,
  },
  {
    id: Tab.Parameters,
    label: 'Paramètres ',
    description: 'Paramètres du livre',
    icon: RectangleGroupIcon,
    active: false,
  },
];
const SidePanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  console.log('#1 SidePanel');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Draw);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const headerHeight = 70;
  const firstTab = tabs[0];
  const isFirstTabActive = firstTab.active;

  const handleTabClick = (tab: Tab) => {
    if (activeTab === tab) {
      // Same tab
      if (isOpen) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    } else {
      setActiveTab(tab);
      if (!isOpen) {
        setIsOpen(true);
      }
    }
  };

  return (
    <aside
      data-id="sidepanel"
      className={`h-full z-10 transition-all`}
      style={{
        width: isOpen ? 400 : 0,
        filter: 'drop-shadow(0px 10px 8px rgba(0,0,0,0.3))',
      }}
    >
      <div data-id="sp-inner" className="relative w-full h-full flex">
        <div
          data-id="sp-content"
          className={`relative flex-1 p-4 overflow-hidden
            bg-primary-50 dark:bg-primary-700
           border-primary-100 dark:border-primary-900`}
          style={{
            width: isOpen ? 400 : 0,
            height: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          <div>
            <div className="absolute top-4 right-4 flex justify-end">
              <ToolbarButton tooltipContent="Fermer">
                <ArrowDownOnSquareStackIcon />
              </ToolbarButton>
            </div>
          
            <GraphicAssets />
          </div>
        </div>
        <div
          data-id="sp-tabs"
          className={`fill-primary-black dark:fill-primary-200
            absolute bottom-0 -right-24`}
        >
          <div data-id="sp-tabs-items">
            {tabs.map((tab, index) => (
              <>
                <button
                  key={`tab-${index}`}
                  data-id={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex justify-center items-center w-24 h-24
                 
                 group
                    bg-primary-100 dark:bg-primary-900  
                 border-l border-primary-200 dark:border-primary-800
                 border-b 

                 hover:bg-primary-50  dark:hover:bg-primary-700
                 last:border-b-0 first:rounded-tr-xl 
                 
                 ${
                   //  tab.active
                   tab.id === activeTab
                     ? 'bg-primary-50 dark:!bg-primary-700 !border-l-0'
                     : ''
                 }
                 `}
                >
                  {index === 0 && (
                    <SidebarCornerTop
                      className={`absolute -top-10 left-0 w-10 h-10
                         fill-primary-100 dark:fill-primary-900
                         group-hover:fill-primary-50 dark:group-hover:fill-primary-700
                         ${
                           tab.id === activeTab
                             ? 'fill-primary-50 dark:!fill-primary-700'
                             : ''
                         }`}
                    />
                  )}

                  <div className="flex flex-col items-center gap-1 ">
                    <tab.icon className="w-6 h-6" />
                    <div>{tab.label}</div>
                  </div>
                </button>
              </>
            ))}
          </div>
        </div>
        {/* <div
            className="relative w-10 h-5 border-l border-l-primary-500"
            style={{ left: '-1Px', top: '-1px' }}
          >
            <SidebarCorner className="fill-primary-50 dark:fill-primary-950" />
          </div>
        </div> */}
      </div>
    </aside>
  );
};

export default SidePanel;
