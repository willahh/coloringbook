import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion'; // Assuming you use framer-motion for animations
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import type { Page } from '@apptypes/book';
import { BookService } from '@/services/book.service';
import { ToolbarButton } from '../ToolbarButton';
import { Tooltip } from '@components/Tooltip';
import { useDispatch } from '@/common/store';
import { PageService } from '@/services/page.service';
import * as BookActions from '../../Book.actions';
import { BookPageParams } from '@/common/interfaces';

interface PageComponentProps {
  bookId: number;
  page: Page;
  selected: boolean;
  onDeleteButtonClick?: (pageId: number) => void;
}

const PageComponent: React.FC<PageComponentProps> = ({
  bookId,
  page: { pageNumber, pageId, thumbImageData, aspectRatio },
  selected,
}) => {
  const dispatch = useDispatch();

  return (
    <motion.div
      key={`pageCmp-${pageId}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        type: 'tween',
      }}
    >
      <Link
        className={`flex flex-col w-full  rounded-sm group overflow-hidden
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
          className={`flex flex-1  bg-primary-100 dark:bg-primary-900 hover:bg-primary-100  dark:hover:bg-primary-300
            ${selected ? ' bg-secondary-100 dark:bg-primary-300 ' : ''}`}
          style={{
            aspectRatio: `${aspectRatio.width}/${aspectRatio.height}`,
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
          <div
            className={`opacity-0 group-hover:opacity-100 group-focus:opacity-100 ${
              selected && 'opacity-100'
            }`}
          >
            <Tooltip content={'Supprimer la page'}>
              <button
                className={`p-xs rounded-sm transition-all cursor-pointer
               ${
                 selected
                   ? 'group-active:opacity-100 hover:bg-secondary-400 focus:bg-secondary-400'
                   : ''
               }`}
                onClick={() => {
                  if (confirm('Confirmer la suppression de la page ?')) {
                    dispatch(BookActions.deletePageAction({ pageId: pageId }));
                  }
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
          <div className="select-none">{pageNumber}</div>
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

const Pages: React.FC<PagesProps> = ({ className, pages }) => {
  const { bookId, pageId } = useParams<BookPageParams>();

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
  // debugger;

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
          />
        ))}
        {index === 0 ? (
          <div data-name="page-placeholder" className=""></div>
        ) : null}
      </div>
    ));
  };

  return (
    <div
      className={`flex flex-col ${className || ''} rounded-md pt-4
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
}> = ({ className, ref, pages }) => {
  const { pageId } = useParams<{ pageId: string }>();
  const dispatch = useDispatch();
  const panelRef = ref;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        panelRef.current &&
        panelRef.current.contains(document.activeElement)
      ) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
          const selectedPage = pages.find(
            (page) => page.pageId === Number(pageId)
          );
          if (
            selectedPage &&
            confirm('Confirmer la suppression de la page ?')
          ) {
            dispatch(
              BookActions.deletePageAction({ pageId: selectedPage.pageId })
            );
            event.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pages, pageId, dispatch]);

  return (
    <div
      data-id="pages-panel"
      ref={ref}
      className={`${className || ''} flex flex-col gap-4 overflow-y-auto 
       z-20
      
      bg-primary-50 dark:bg-primary-950`}
    >
      <Pages className="p-2 flex-1" pages={pages} />
      <div className="flex justify-center pt-4">
        <ToolbarButton
          className="!rounded-full"
          tooltipContent="Ajouter une page"
          onClick={() => {
            dispatch(
              BookActions.addPageAction({ page: PageService.getNewPage(pages) })
            );
          }}
        >
          <PlusIcon
            className="w-full h-full size-6 fill-primary-200 group-hover:fill-white group-focus:fill-white"
            style={{ strokeWidth: '0.05em' }}
          />
        </ToolbarButton>
      </div>
    </div>
  );
};
