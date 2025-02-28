import {
  ArrowDownOnSquareStackIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { ToolbarButton } from '../components/ToolbarButton';
import { bookService } from '@/services/book.service';
import useCanvasContext from '../useCanvasContext';
import { useSelector } from '@/common/store';
import { selectBookPages } from '../Book.slice';

const BookToolbar: React.FC = () => {
  const { canvas } = useCanvasContext();
  const pages = useSelector(selectBookPages);
  const iconProps = {
    className: 'w-8 h-8',
    strokeWidth: 0.5,
  };

  return (
    <div>
      <div
        className={`flex flex-col relative h-full z-20  justify-center gap-4
         bg-primary-50 dark:bg-primary-950
         border-r border-primary-100 dark:border-primary-900 `}
      >
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
                  pages: pages,
                });
              }
            }}
          >
            <ArrowDownTrayIcon {...iconProps} />
          </ToolbarButton>
          <ToolbarButton
            tooltipContent="Print"
            onClick={async () => {
              if (canvas) {
                await bookService.printPDF({
                  canvas: canvas,
                  pages: pages,
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
