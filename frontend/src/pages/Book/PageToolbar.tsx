import * as Slider from '@radix-ui/react-slider';
import {
  ArrowDownOnSquareStackIcon,
  MagnifyingGlassCircleIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/20/solid';
import { ToolbarButton } from './ToolbarButton';

const iconProps = {
  className: 'w-12 h-12',
  stroke: 'currentColor',
  fill: 'none',
  strokeWidth: 0.5,
};

export const PageToolbar: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = () => {
  return (
    <>
      <MagnifyingGlassCircleIcon className="w-10 h-10" />
      <div
        data-name="PageToolbar"
        className="bg-white rounded-lg p-4 shadow-lg"
        style={{ maxWidth: '300px' }}
      >
        {/* <Range />
         */}

        <Slider.Root
          className="relative flex h-5 w-[200px] touch-none select-none items-center"
          defaultValue={[50]}
          max={100}
          step={1}
        >
          <Slider.Track className="relative h-[3px] grow rounded-full bg-primary-200">
            <Slider.Range className="absolute h-full rounded-full bg-black" />
          </Slider.Track>
          <Slider.Thumb
            className="block size-5 rounded-[10px] bg-black shadow-[0_2px_10px] shadow-black hover:bg-violet300 focus:shadow-[0_0_0_5px] focus:shadow-black focus:outline-none transition-all"
            aria-label="Volume"
          />
        </Slider.Root>
      </div>

      <div
        // className="bg-white rounded-lg p-4 shadow-lg"
        style={{ maxWidth: '300px' }}
      >
        <span className="isolate inline-flex rounded-md ">
          <ToolbarButton tooltipText="Save">
            <ArrowDownOnSquareStackIcon {...iconProps} />
          </ToolbarButton>
          <ToolbarButton tooltipText="Export">
            <DocumentArrowDownIcon {...iconProps} />
          </ToolbarButton>
          <ToolbarButton tooltipText="Import">
            <DocumentArrowUpIcon {...iconProps} />
          </ToolbarButton>
          <ToolbarButton tooltipText="Download">
            <ArrowDownTrayIcon {...iconProps} />
          </ToolbarButton>
        </span>
      </div>
    </>
  );
};
