import { Tab, TabType } from './../TabsConfig';
import SidebarCornerTop from '@assets/sidebar-corner-top.svg?react';

const Tabs: React.FC<{
  tabsConfig: Tab[];
  activeTab: TabType;
  onTabClick: (tabId: number) => void;
}> = ({ tabsConfig: tabs, activeTab, onTabClick }) => {
  return (
    <div
      data-id="sp-tabs"
      className={`fill-primary-black dark:fill-primary-200
      absolute bottom-0 -right-18`}
    >
      <div data-id="sp-tabs-items">
        {tabs.map((tab, index) => (
          <button
            key={`tab-${index}`}
            data-id={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`relative flex justify-center items-center w-18 h-18
           
           group
          bg-primary-100 dark:bg-primary-900  
           border-l border-primary-200 dark:border-primary-800
           border-b 

           hover:bg-primary-50  dark:hover:bg-primary-700
           last:border-b-0 first:rounded-tr-xl 
           
           ${
             tab.id === activeTab
               ? 'bg-primary-50 dark:!bg-primary-700 text-secondary-500 !border-l-0'
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

            <div className="flex flex-col items-center gap-1 select-none">
              {tab.icon}
              <div className="text-xs">{tab.label}</div>
            </div>
          </button>
        ))}
        <div className="h-16 bg-primary-100 dark:bg-primary-900  "></div>
      </div>
    </div>
  );
};

export default Tabs;
