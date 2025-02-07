import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Switch from '@/components/Switch';
import { Tooltip } from '@components/Tooltip';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ToolbarButtonClassName } from '@/module/book/ui/ToolbarButton';
import { useTheme } from '@/common/contexts/ThemeContext';

type ThemeAppearance = 'light' | 'dark';

export default function Example() {
  const { appearance, switchAppearance } = useTheme();

  const getMenuItemClassName = (
    appearance: ThemeAppearance,
    appearanceMenu: ThemeAppearance
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
        className={`absolute right-0 z-10 overflow-hidden origin-top-right rounded-md
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
              switchAppearance('dark');
            }}
            className={getMenuItemClassName(appearance, 'dark')}
          >
            <MoonIcon className="w-5 h-5" />
            Dark
          </a>
        </MenuItem>
        {/* <MenuItem>
          <a href="#" className={itemCls(appearance, 'dark')}>
            <ComputerDesktopIcon className="w-5 h-5" />
            Système
          </a>
        </MenuItem> */}
      </MenuItems>
    </Menu>
  );
}

/**
 * A 12 column debug grid displayed as an overlay when the parameter
 * ?griddebug=1 is present in the URL
 */
export const GridDebug = () => (
  <div
    data-id="grid-debug"
    className="absolute w-full h-full grid grid-cols-12 gap-4 opacity-10 z-10 
  pointer-events-none dark:text-white text-center"
  >
    <div className="col-span-1 bg-yellow-500  border border-black pt-6">1</div>
    <div className="col-span-1 bg-red-500     border border-black pt-6">2</div>
    <div className="col-span-1 bg-primary-500    border border-black pt-6">
      3
    </div>
    <div className="col-span-1 bg-lime-500    border border-black pt-6">4</div>
    <div className="col-span-1 bg-cyan-500    border border-black pt-6">5</div>
    <div className="col-span-1 bg-rose-500    border border-black pt-6">6</div>
    <div className="col-span-1 bg-yellow-500  border border-black pt-6">7</div>
    <div className="col-span-1 bg-red-500     border border-black pt-6">8</div>
    <div className="col-span-1 bg-primary-500    border border-black pt-6">
      9
    </div>
    <div className="col-span-1 bg-lime-500    border border-black pt-6">10</div>
    <div className="col-span-1 bg-cyan-500    border border-black pt-6">11</div>
    <div className="col-span-1 bg-rose-500    border border-black pt-6">12</div>
  </div>
);

export const DebugButton = () => {
  // const [isTooltipVisible, setTooltipVisible] = useState(true);

  return (
    <div data-id="setting-button" className="absolute top-0 right-0 p-5 z-20">
      <div className="flex items-center gap-4 relative">
        <Example />
        <Popover className="">
          <Tooltip content="Préférences">
            <PopoverButton
              className={ToolbarButtonClassName('!rounded-full')}
              onClick={() => {
                // setTooltipVisible(false);
              }}
            >
              <AdjustmentsHorizontalIcon
                aria-hidden="true"
                className="size-5"
              />
            </PopoverButton>
          </Tooltip>
          <PopoverPanel anchor="bottom" className="flex flex-col pr-4">
            <div className="divide-y divide-gray-800 dark:divide-gray-200 overflow-hidden rounded-lg p-4 whitespace-nowrap bg-black dark:bg-white shadow">
              <div className="grid grid-cols-2 gap-2">
                <Switch checked={false} onChange={() => {}} />
                <label htmlFor="a">Debug grid</label>
              </div>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  );
};
