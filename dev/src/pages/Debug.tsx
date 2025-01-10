import React, { useEffect, useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Tooltip } from '@/components/Tooltip';
import Switch from '@/components/Switch';

/**
 * FIXME: Le composant Switch n'est pas encore disponible dans le client.
 */

/**
 * A 12 column debug grid displayed as an overlay when the parameter
 * ?griddebug=1 is present in the URL
 */
export const GridDebug = () => (
  <div data-id="grid-debug" className="absolute w-full h-full grid grid-cols-12 gap-4 opacity-20 z-10 pointer-events-none dark pointer-events-none" >
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
    <div className="col-span-1 border border-black dark:border-white pointer-events-none"></div>
  </div>
);

export const DebugButton = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const [isTooltipVisible, setTooltipVisible] = useState(true);
  const [isGridDebug, setGridDebug] = useState(
    urlParams.get('griddebug') === '1'
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const griddebug = urlParams.get('griddebug');
    setGridDebug(griddebug === '1');
  }, []);

  const handleSwitchChange = () => {
    console.log('handleSwitchChange');

    const url = new URL(window.location.href);
    if (isGridDebug) {
      url.searchParams.set('griddebug', '0');
    } else {
      url.searchParams.set('griddebug', '1');
    }
    window.history.pushState({}, '', url);
    setGridDebug(!isGridDebug);
  };

  interface DebugFormProps {
    isGridDebug: boolean;
    handleSwitchChange?: () => void;
  }

  const DebugForm: React.FC<DebugFormProps> = ({ isGridDebug }) => (
    <div className="grid grid-cols-2 gap-2">
      <Switch checked={isGridDebug} onChange={handleSwitchChange} />
      <label>Debug grid</label>
    </div>
  );

  return (
    <div data-id="debug" className="absolute top-0 right-0 p-5">
      <div className="relative">
        <Popover className="absolute top-0 right-0">
          <Tooltip text="Préférences" isVisible={isTooltipVisible}>
            <PopoverButton
              className="rounded-full bg-indigo-900 text-white shadow-sm p-3 outline outline-offset-2 outline-transparent
            hover:bg-indigo-500 hover:scale-110
            focus-visible:outline focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
            transition-all duration-300 "
              onClick={() => {
                setTooltipVisible(false);
              }}
            >
              <AdjustmentsHorizontalIcon
                aria-hidden="true"
                className="size-5"
              />
            </PopoverButton>
          </Tooltip>
          <PopoverPanel anchor="bottom" className="flex flex-col pr-4">
            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg p-4 whitespace-nowrap bg-white shadow">
              <DebugForm isGridDebug={true} />
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  );
};
