import React from 'react';

import { TabType } from './sidepanel.types';
import Tabs from './Tabs';
// import UserContent from './user/UserContent';
// import AssetList from '../../AssetList';
import useLocalStorage from '@/common/hooks/useLocalStorage';
import { TabsConfig, TabsConfigDesktop } from '../TabsConfig';

const SidePanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
  ref: React.RefObject<HTMLElement>;
  // setSidePanelWidth: React.Dispatch<React.SetStateAction<number>>;
}> = ({ className, ref }) => {
  const [activeTab, setActiveTab] = useLocalStorage(
    'selectedTab',
    TabType.Element
  );
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(
    'sidebarOpen',
    true
  );

  const handleTabClick = (tab: TabType) => {
    if (activeTab === tab) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setActiveTab(tab);
      if (!isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    }
  };
  const width = 360;
  return (
    <aside
      ref={ref}
      data-id="sidepanel"
      className={`${className || ''} h-full z-10 transition-all`}
      style={{
        width: isSidebarOpen ? width : 0,
        filter: 'drop-shadow(0px 10px 8px rgba(0,0,0,0.3))',
      }}
    >
      <div data-id="sp-inner" className="relative w-full h-full flex">
        <div
          data-id="sp-content"
          className={`relative flex-1 overflow-hidden 
           bg-primary-50 dark:bg-primary-900
           border-primary-100 dark:border-primary-900`}
          style={{
            width: isSidebarOpen ? width : 0,
            height: `calc(100vh)`,
          }}
        >
          <div className="flex-1 p-4 overflow-auto h-full">
            {TabsConfig.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>
        <Tabs
          tabsConfig={TabsConfigDesktop}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
      </div>
    </aside>
  );
};

export default SidePanel;
