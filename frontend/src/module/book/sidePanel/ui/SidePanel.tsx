import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDownOnSquareStackIcon,
  PaintBrushIcon,
  RectangleGroupIcon,
  UserIcon,
  // EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

import TextIcon from '@assets/icons/icon_text.svg?react';
// import SidebarCorner from '@asùsets/sidebar-corner.svg?react';
import { ToolbarButton } from '../../ui/ToolbarButton';
import GraphicAssets from './../graphicAssets/GraphicAssets';
import { /*initialState,*/ TabType, Tab } from './../sidepanel.types';
import Tabs from './Tabs';
import UserContent from './content/user/UserContent';
import ElementContent from './content/element/ElementContent';

const tabs: Tab[] = [
  {
    id: TabType.Personal,
    label: 'Personnel',
    description: 'Charger vos images',
    icon: UserIcon,
    active: false,
    content: <UserContent />,
  },
  {
    id: TabType.Element,
    label: 'Eléments',
    icon: PaintBrushIcon,
    active: true,
    content: <ElementContent />,
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
    id: TabType.Background,
    label: 'Fonds',
    icon: RectangleGroupIcon,
    active: false,
    content: <div>Fonds</div>,
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
}> = (/*{ className, children }*/ { ref, setSidePanelWidth }) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Element);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const headerHeight = 70;
  const isAnimatingRef = useRef(false);

  const handleTabClick = (tab: TabType) => {
    if (activeTab === tab) {
      setIsOpen(!isOpen);
    } else {
      setActiveTab(tab);
      if (!isOpen) {
        setIsOpen(true);
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

  return (
    <aside
      ref={ref}
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
          className={`relative flex-1 overflow-hidden rounded-tl-4xl
           bg-primary-50 dark:bg-primary-700
           border-primary-100 dark:border-primary-900`}
          style={{
            width: isOpen ? 400 : 0,
            // height: `calc(100vh - ${headerHeight}px)`,
            height: `calc(100vh)`,
          }}
        >
          <div className="p-4">
            {activeTab == TabType.Personal && <UserContent />}
            {activeTab == TabType.Element && <ElementContent />}
          </div>
        </div>
        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
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
