import { Popover, PopoverPanel } from '@headlessui/react';
import Switch from '@components/Switch';

// import Appearance from './Appearance';

export const InterfaceControls = () => {
  return (
    <div data-id="setting-button" className="absolute top-0 right-0 p-5 z-20">
      <div className="flex items-center gap-4 relative">
        {/* <Appearance /> */}
        <Popover className="">
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
