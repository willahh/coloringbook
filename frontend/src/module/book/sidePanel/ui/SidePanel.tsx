import React from 'react';
import {
  PaintBrushIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';

import TextIcon from '@assets/icons/icon_text.svg?react';
import SidebarCorner from '@assets/sidebar-corner.svg?react';

const tabs = [
  { id: 'draw', label: 'Dessin', icon: PaintBrushIcon, active: false },
  { id: 'texte', label: 'Texte', icon: TextIcon, active: false },
  { id: 'shape', label: 'Formes', icon: RectangleGroupIcon, active: true },
];
const SidePanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  const headerHeight = 70;
  return (
    <aside
      data-id="sidepanel"
      className={`h-full z-10`}
      style={{
        width: 400,
        filter: 'drop-shadow(0px 10px 8px rgba(0,0,0,0.3))',
      }}
    >
      <div data-id="sp-inner" className="relative w-full h-full flex">
        <div
          data-id="sp-content"
          className={`flex-1 bg-primary-50 dark:bg-primary-700 
           border-primary-100 dark:border-primary-900`}
          style={{ height: `calc(100vh - ${headerHeight}px)` }}
          
        >
          content
        </div>
        <div
          data-id="sp-tabs"
          className={`fill-primary-black dark:fill-primary-200
            absolute -right-24`}
        >
          <div className="divide-y divide-primary-100 dark:divide-primary-900">
            {tabs.map((tab) => (
              <div
                data-id={tab.id}
                className={`flex justify-center items-center w-24 h-24
                 dark:bg-primary-950 bg-primary-50 
                 last:rounded-br-xl
                 ${tab.active ? 'dark:bg-primary-700' : ''}
                 `}
              >
                <div className="flex flex-col items-center gap-1">
                  <tab.icon className="w-6 h-6" />
                  <div>{tab.label}</div>
                </div>
              </div>
            ))}
          </div>
          {(() => {
            const lastTab = tabs[tabs.length - 1];
            const isLastTabActive = lastTab.active;
            return (
              <div className="relative w-10 h-5">
                <SidebarCorner
                  className={`fill-primary-50 dark:fill-primary-950 ${
                    isLastTabActive ? 'dark:fill-primary-700' : ''
                  }`}
                />
              </div>
            );
          })()}
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
