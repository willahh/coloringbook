import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

import { useTheme } from '@/common/contexts/ThemeContext';
import { Tooltip } from '@components/Tooltip';
import { ToolbarButtonClassName } from '@/module/book/components/ToolbarButton';
import {
  APPEAREANCE_DARK,
  APPEAREANCE_LIGHT,
  trackEvent,
} from '../utils/analyticsEvents';

export type Appearance = 'light' | 'dark';

const Appearance: React.FC = () => {
  const { appearance, switchAppearance } = useTheme();

  const getMenuItemClassName = (
    appearance: Appearance,
    appearanceMenu: Appearance
  ) => {
    return `flex items-center gap-2 p-3 text-sm
               
    ${
      appearance === appearanceMenu
        ? 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100 font-bold text:black dark:text:white'
        : 'text-gray-500 dark:text-gray-500'
    }
     data-[focus]:bg-gray-100 dark:data-[focus]:bg-gray-900 data-[focus]:text-gray-900 dark:data-[focus]:text-gray-100 data-[focus]:outline-none
     
     `;
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Tooltip content="Apparence">
        <MenuButton
          className={`${ToolbarButtonClassName(
            'flex items-center gap-2 !rounded-full'
          )}`}
        >
          <MoonIcon className="w-5 h-5" />
        </MenuButton>
      </Tooltip>

      <MenuItems
        transition
        className={`absolute lg:bottom-12 right-0 z-10 overflow-hidden origin-top-right rounded-md
           bg-white dark:bg-black shadow-lg ring-1 ring-black/5 
           transition 
           focus:outline-none 
           data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 
           data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in`}
      >
        <MenuItem>
          <a
            href="#"
            onClick={() => {
              trackEvent(APPEAREANCE_LIGHT);
              switchAppearance('light');
            }}
            className={getMenuItemClassName(appearance, 'light')}
          >
            <SunIcon className="w-5 h-5" />
            Light
          </a>
        </MenuItem>
        <MenuItem>
          <a
            href="#"
            onClick={() => {
              trackEvent(APPEAREANCE_DARK);
              switchAppearance('dark');
            }}
            className={getMenuItemClassName(appearance, 'dark')}
          >
            <MoonIcon className="w-5 h-5" />
            Dark
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default Appearance;
