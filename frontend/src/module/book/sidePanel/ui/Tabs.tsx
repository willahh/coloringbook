import { Tab, TabType } from '../sidepanel.types';
import SidebarCornerTop from '@assets/sidebar-corner-top.svg?react';
('z(e');

const Tabs: React.FC<{
  tabs: Tab[];
  activeTab: TabType;
  onTabClick: (tabId: number) => void;
}> = ({ tabs, activeTab, onTabClick }) => {
  return (
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
              onClick={() => onTabClick(tab.id)}
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
  );
};

export default Tabs;
