import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
// import { Tooltip } from '@/components/Tooltip';
import Switch from '@/components/Switch';

/**
 * A 12 column debug grid displayed as an overlay when the parameter
 * ?griddebug=1 is present in the URL
 */
export const GridDebug = () => (
  <div data-id="grid-debug"
    className="absolute w-full h-full grid grid-cols-12 gap-4 opacity-10 z-10 
  pointer-events-none text-white text-center"
  >
    <div className="col-span-1 bg-yellow-500  border border-black pt-6">1</div>
    <div className="col-span-1 bg-red-500     border border-black pt-6">2</div>
    <div className="col-span-1 bg-primary-500    border border-black pt-6">3</div>
    <div className="col-span-1 bg-lime-500    border border-black pt-6">4</div>
    <div className="col-span-1 bg-cyan-500    border border-black pt-6">5</div>
    <div className="col-span-1 bg-rose-500    border border-black pt-6">6</div>
    <div className="col-span-1 bg-yellow-500  border border-black pt-6">7</div>
    <div className="col-span-1 bg-red-500     border border-black pt-6">8</div>
    <div className="col-span-1 bg-primary-500    border border-black pt-6">9</div>
    <div className="col-span-1 bg-lime-500    border border-black pt-6">10</div>
    <div className="col-span-1 bg-cyan-500    border border-black pt-6">11</div>
    <div className="col-span-1 bg-rose-500    border border-black pt-6">12</div>
  </div>
);

export const DebugButton = () => {
  // const [isTooltipVisible, setTooltipVisible] = useState(true);

  return (
    <div data-id="setting-button" className="absolute top-0 right-0 p-5">
      <div className="relative">
        <Popover className="absolute top-0 right-0">
          {/* <Tooltip text="Préférences" isVisible={isTooltipVisible}> */}
            <PopoverButton
              className="rounded-full bg-primary-900 text-white shadow-sm p-3 outline outline-offset-2 outline-transparent
            hover:bg-primary-500 hover:scale-110
            focus-visible:outline focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600
            transition-all duration-300 "
              onClick={() => {
                // setTooltipVisible(false);
              }}
            >
              <AdjustmentsHorizontalIcon
                aria-hidden="true"
                className="size-5"
              />
            </PopoverButton>
          {/* </Tooltip> */}
          <PopoverPanel anchor="bottom" className="flex flex-col pr-4">
            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg p-4 whitespace-nowrap bg-white shadow">
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
