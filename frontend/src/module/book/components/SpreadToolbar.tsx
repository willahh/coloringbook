import React, { useContext } from 'react';
import * as Slider from '@radix-components/react-slider';

import {
  ArrowDownOnSquareStackIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { bookService } from '@/services/book.service';
import { BookContext } from '../book.context';
import { ToolbarButton } from './ToolbarButton';
import { useAppDispatch, useAppSelector } from '@/common/hooks/useRedux';
import { selectBook } from '../book.state';
import { useParams } from 'react-router';

const iconProps = {
  className: 'w-12 h-12',
  strokeWidth: 0.5,
};

export const SpreadToolbar: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = () => {
  const { canvas } = useContext(BookContext);
  // useAppDispatch();
  const { book } = useAppSelector(selectBook);
  const { pageId } = useParams<{ pageId?: string }>();
  const totalPages = book.pages.length;
  const currentPage = pageId ? parseInt(pageId) : 1;

  return (
    <div
      data-id="spread-toolbar"
      className={`relative gap-4 p-4 h-36 
         bg-primary-50 dark:bg-primary-900`}
    >
      <div
        className={`flex h-12 justify-center items-center `}
      >
        <div className="text-sm text-gray-600">{`Page ${currentPage} / ${totalPages}`}</div>
        <MagnifyingGlassIcon className="w-6 h-6" />
        <Slider.Root
          className="relative flex h-5 w-[200px] touch-none select-none items-center"
          defaultValue={[50]}
          max={100}
          step={1}
        >
          <Slider.Track className="relative h-[3px] grow rounded-full bg-primary-800 dark:bg-primary-200">
            <Slider.Range className="absolute h-full rounded-full bg-black dark:bg-white" />
          </Slider.Track>
          <Slider.Thumb
            className="block size-5 rounded-[10px] bg-black dark:bg-white shadow-[0_2px_10px] shadow-black dark:shadow-white hover:bg-primary-700 dark:hover:bg-primary-300 focus:shadow-[0_0_0_5px] focus:shadow-white dark:focus:shadow-black focus:outline-none transition-all"
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
    </div>
  );
};
