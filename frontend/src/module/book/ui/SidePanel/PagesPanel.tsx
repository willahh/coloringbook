import { motion } from 'framer-motion'; // Assuming you use framer-motion for animations
import type { Page } from '@/types/book';
import { useContext } from 'react';
import { BookContext } from '../../book.context';
import { Link } from 'react-router-dom';
import { BookService } from '@/services/book.service';
import { ToolbarButton } from '../ToolbarButton';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@components/Tooltip';

interface PageComponentProps {
  bookId: number;
  page: Page;
  selected: boolean;
  onDeleteButtonClick?: (pageId: number) => void;
}

const PageComponent: React.FC<PageComponentProps> = ({
  bookId,
  page: { pageNumber, pageId, thumbImageData },
  onDeleteButtonClick,
  selected,
}) => {
  // const transitionDelay = pageNumber / 12;

  return (
    <motion.div
      key={`pageCmp-${pageId}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        // delay: transitionDelay,
        duration: 0.1,
        type: 'tween',
      }}
    >
      <Link
        className={`flex flex-col w-14 h-20 rounded-sm group overflow-hidden
        border-2 border-primary-200 dark:border-primary-800 
        hover:border-secondary-500
        active:ring-2 active:-ring-offset-4 ring-secondary-500
        transition-all duration-150 ease-in-out
      
      ${
        selected
          ? ' border-2 border-secondary-200 dark:border-secondary-500 '
          : ''
      }
      
      `}
        to={`/book/${bookId}/pages/${pageId}`}
      >
        <div
          data-id="page-bg"
          className={`flex flex-1 bg-primary-100 dark:bg-primary-900 hover:bg-primary-100  dark:hover:bg-primary-300
            ${selected ? ' bg-secondary-100 dark:bg-primary-300 ' : ''}`}
          style={{
            backgroundImage: `url(${thumbImageData})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        ></div>
        <div
          data-id="page-option"
          className={`flex justify-end items-center gap-2 
            transition-all duration-200
           bg-primary-200 dark:bg-primary-800 text-xs p-0.5 text-right
        ${
          selected
            ? 'bg-secondary-300 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 font-extrabold'
            : ''
        }`}
        >
          <Tooltip content={'Supprimer la page'}>
            <button
              className={`hidden 
                p-xs rounded-sm transition-all
                
               ${
                 selected
                   ? 'group-hover:block group-focus:block group-active:block hover:bg-secondary-400 focus:bg-secondary-400'
                   : ''
               }`}
              onClick={() => {
                if (onDeleteButtonClick) {
                  onDeleteButtonClick(pageId);
                }
              }}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <div>{pageNumber}</div>
        </div>
      </Link>
    </motion.div>
  );
};

interface PagesProps {
  className?: string;
  pages: Page[];
  onDeleteButtonClick?: (pageId: number) => void;
}

const Pages: React.FC<PagesProps> = ({
  className,
  pages,
  onDeleteButtonClick,
}) => {
  const {
    pageParams: { pageId, bookId },
  } = useContext(BookContext);
  const selectedPageId = pageId ? Number(pageId) : -1;
  const useSpread = false;
  let spreads: Page[][] = [];

  if (pages.length > 0) {
    if (useSpread) {
      spreads = BookService.transformPagesToSpread(pages);
    } else {
      spreads = [pages];
    }
  }

  const renderSpreads = () => {
    return spreads.map((spread, index) => (
      <div
        key={`spread-${index}`}
        className={`flex gap-4 ${
          useSpread ? 'flex-row' : 'flex-col'
        } justify-center`}
      >
        {spread.map((page) => (
          <PageComponent
            key={page.pageId} // Ajoutez cette ligne
            bookId={Number(bookId)}
            page={page}
            selected={page.pageId === selectedPageId}
            onDeleteButtonClick={onDeleteButtonClick}
          />
        ))}
        {index === 1 ? <div className="w-14 h-20 "></div> : null}
      </div>
    ));
  };

  return (
    <div
      className={`flex flex-col ${className || ''} rounded-md 
 overflow-y-scroll scrollbar scrollbar-thumb-primary-300 
 dark:scrollbar-thumb-primary-700 scrollbar-track-primary-100 dark:scrollbar-track-primary-900 scrollbar-track-rounded-full`}
      style={{
        maxHeight: 'calc(100vh - 10em)', // FIXME: magic number 10em
      }}
    >
      {renderSpreads()}
    </div>
  );
};

export default Pages;

export const PagesPanel: React.FC<{
  className?: string;
  ref: React.RefObject<HTMLDivElement>;
  pages: Page[];
  addPageButtonClick: (event: React.MouseEvent) => void;
  onDeleteButtonClick?: (pageId: number) => void;
}> = ({ className, ref, pages, addPageButtonClick, onDeleteButtonClick }) => {
  return (
    <div
      ref={ref}
      className={`${
        className || ''
      } flex flex-col p-4 pr-0 gap-4 overflow-y-auto`}
    >
      <Pages pages={pages} onDeleteButtonClick={onDeleteButtonClick} />
      <ToolbarButton
        className="!rounded-full"
        tooltipContent="Ajouter une page"
        onClick={addPageButtonClick}
      >
        <PlusIcon
          className="w-full h-full size-6 fill-primary-200 group-hover:fill-white group-focus:fill-white"
          style={{ strokeWidth: '0.05em' }}
        />
      </ToolbarButton>
    </div>
  );
};
