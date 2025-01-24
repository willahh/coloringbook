import React, { useContext } from 'react';
import * as Slider from '@radix-ui/react-slider';
import {
  ArrowDownOnSquareStackIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { ToolbarButton } from './ToolbarButton';
import { CanvasContext } from '../../page';
import { bookService } from '@/services/BookService';

const iconProps = {
  className: 'w-12 h-12',
  strokeWidth: 0.5,
};

export const SpreadToolbar: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = () => {
  const { canvas } = useContext(CanvasContext);

  return (
    <div className="flex justify-center  items-center gap-4 p-4">
      <MagnifyingGlassIcon className="w-6 h-6" />
      <Slider.Root
        className="relative flex h-5 w-[200px] touch-none select-none items-center"
        defaultValue={[50]}
        max={100}
        step={1}
      >
        <Slider.Track className="relative h-[3px] grow rounded-full bg-primary-200">
          <Slider.Range className="absolute h-full rounded-full bg-white" />
        </Slider.Track>
        <Slider.Thumb
          className="block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-white hover:bg-violet300 focus:shadow-[0_0_0_5px] focus:shadow-black focus:outline-none transition-all"
          aria-label="Volume"
        />
      </Slider.Root>
      <div className="flex gap-2">
        <ToolbarButton tooltipContent="Save">
          <ArrowDownOnSquareStackIcon {...iconProps} />
        </ToolbarButton>
        <ToolbarButton tooltipContent="Export">
          <DocumentArrowDownIcon {...iconProps} />
        </ToolbarButton>
        <ToolbarButton tooltipContent="Import">
          <DocumentArrowUpIcon {...iconProps} />
        </ToolbarButton>
        <ToolbarButton
          tooltipContent="Download"
          onClick={() => {
            if (canvas) {
              bookService.exportToPDF({
                canvas: canvas,
                dimensions: { width: 640, height: 480 },
              });
            }
          }}
        >
          <ArrowDownTrayIcon {...iconProps} />
        </ToolbarButton>
        <ToolbarButton
          tooltipContent="Print"
          onClick={() => {
            if (canvas) {
              bookService.printPDF({
                canvas: canvas,
              });
            }
          }}
        >
          <PrinterIcon {...iconProps} />
        </ToolbarButton>
      </div>
    </div>
  );
};
