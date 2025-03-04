import React, { useEffect, useRef } from 'react';
import {
  PaintBrushIcon,
  RectangleGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import TextIcon from '@assets/icons/icon_text.svg?react';
import { TabType, Tab } from './sidepanel.types';
import Tabs from './Tabs';
import UserContent from './user/UserContent';
import ElementTabContent from './element/ElementContent';
import useLocalStorage from '@/common/hooks/useLocalStorage';

const tabs: Tab[] = [
  {
    id: TabType.Element,
    label: 'Eléments',
    icon: PaintBrushIcon,
    active: true,
    content: <ElementTabContent />,
  },
  {
    id: TabType.Text,
    label: 'Texte',
    icon: TextIcon,
    active: false,
    content: <div>Texte</div>,
  },
  {
    id: TabType.Shape,
    label: 'Formes',
    icon: RectangleGroupIcon,
    active: false,
    content: <div>Formes</div>,
  },
  {
    id: TabType.Draw,
    label: 'Dessins',
    icon: RectangleGroupIcon,
    active: false,
    content: <div>Dessins</div>,
  },
  {
    id: TabType.Background,
    label: 'Fonds',
    icon: RectangleGroupIcon,
    active: false,
    content: <div>Fonds</div>,
  },
  {
    id: TabType.Personal,
    label: 'Personnel',
    description: 'Charger vos images',
    icon: UserIcon,
    active: false,
    content: <UserContent />,
  },
  {
    id: TabType.Parameters,
    label: 'Paramètres ',
    description: 'Paramètres du livre',
    icon: RectangleGroupIcon,
    active: false,
    content: <div>Paramètres du livre</div>,
  },
];
const SidePanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
  ref: React.RefObject<HTMLElement>;
  setSidePanelWidth: React.Dispatch<React.SetStateAction<number>>;
}> = ({ className, ref, setSidePanelWidth }) => {
  const [activeTab, setActiveTab] = useLocalStorage(
    'selectedTab',
    TabType.Element
  );
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(
    'sidebarOpen',
    true
  );

  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAnimatingRef = useRef(false);

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

  useEffect(() => {
    if (ref.current) {
      const handleTransitionEnd = () => {
        isAnimatingRef.current = false;
        if (ref.current) {
          setSidePanelWidth(ref.current.offsetWidth);
        }
      };

      ref.current.addEventListener('transitionend', handleTransitionEnd);

      return () => {
        if (ref.current) {
          ref.current.removeEventListener('transitionend', handleTransitionEnd);
        }
      };
    }
  }, [ref.current]);
  const width = 280;
  return (
    <aside
      ref={ref}
      data-id="side-panel"
      data-testid="side-panel"
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
           bg-primary-50 dark:bg-primary-700
           border-primary-100 dark:border-primary-900`}
          style={{
            width: isSidebarOpen ? width : 0,
            // height: `calc(100vh - ${headerHeight}px)`,
            height: `calc(100vh)`,
          }}
        >
          <div className="p-4">
            {activeTab == TabType.Personal && <UserContent />}
            {activeTab == TabType.Element && <ElementTabContent />}
          </div>
        </div>
        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      </div>
    </aside>
  );
};

export default SidePanel;
