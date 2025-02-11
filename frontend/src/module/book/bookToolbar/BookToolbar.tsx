import {
  ArrowDownOnSquareStackIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { ToolbarButton } from '../ui/ToolbarButton';
import { bookService } from '@/services/book.service';
import { BookContext } from '../book.context';
import { useContext } from 'react';

const BookToolbar: React.FC = () => {
  const { canvas } = useContext(BookContext);
  const iconProps = {
    className: 'w-12 h-12',
    strokeWidth: 0.5,
  };

  return (
    <div>
      <div className="flex flex-col relative h-full z-20 justify-center gap-4 bg-primary-50 dark:bg-primary-950 ">
        <div>
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

export default BookToolbar;
