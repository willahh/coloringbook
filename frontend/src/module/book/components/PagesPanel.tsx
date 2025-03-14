import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion'; // Assuming you use framer-motion for animations
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import type { Page } from '@apptypes/book';
import { ToolbarButton } from './ToolbarButton';
import { Tooltip } from '@components/Tooltip';
import { useDispatch, useSelector } from '@/common/store';
import { PageService } from '@/services/PageService';
import * as BookActions from '../BookActions';
import { BookPageParams } from '@/common/interfaces';
import { selectBookPages } from '../BookSlice';
import { useServices } from '@/common/contexts/ServiceContext';
import { trackBookEvent } from '@/common/utils/analyticsEvents';

interface PageComponentProps {
  bookId: number;
  page: Page;
  selected: boolean;
  onDeleteButtonClick?: (pageId: number) => void;
}

const useDeletePage = (bookId: number) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pages = useSelector(selectBookPages);
  const { bookDataService } = useServices();

  const useDeletePage = (pageIdToDelete: number) => {
    if (confirm('Confirmer la suppression de la page ?')) {
      trackBookEvent('BOOK_PAGE_DELETE', { id: bookId, name: '' });
      dispatch(BookActions.deletePageAction({ pageId: pageIdToDelete }));
      requestAnimationFrame(() => {
        const nextPageId = bookDataService.getNextPageId(pageIdToDelete, pages);
        if (nextPageId !== undefined && bookId) {
          navigate(`/book/${bookId}/pages/${nextPageId}`);
        }
      });
    }
  };

  return useDeletePage;
};

const useAddPage = (bookId: number) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pages = useSelector(selectBookPages);

  const useAddPage = () => {
    const pageNew = PageService.getNewPage(pages);
    trackBookEvent('BOOK_PAGE_ADD', { id: bookId, name: '' });
    dispatch(BookActions.addPageAction({ page: pageNew }));
    requestAnimationFrame(() => {
      if (bookId) {
        navigate(`/book/${bookId}/pages/${pageNew.pageId}`);
      }
    });
  };

  return useAddPage;
};

const PageComponent: React.FC<PageComponentProps> = ({
  bookId,
  page: { pageNumber, pageId, thumbImageData, aspectRatio },
  selected,
}) => {
  const deletePageFn = useDeletePage(bookId);

  return (
    <motion.div
      data-id={`sp-page-${pageId}`}
      key={`pageCmp-${pageId}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        type: 'tween',
      }}
    >
      <Link
        className={`flex flex-col w-full rounded-sm group overflow-hidden
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
            ? 'bg-secondary-300 dark:bg-secondary-500 text-secondary-800 dark:text-secondary-300 font-extrabold'
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
                  deletePageFn(pageId);
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
  const { bookDataService } = useServices();

  const selectedPageId = pageId ? Number(pageId) : -1;
  const useSpread = false;
  let spreads: Page[][] = [];

  if (pages.length > 0) {
    if (useSpread) {
      spreads = bookDataService.transformPagesToSpread(pages);
    } else {
      spreads = [pages];
    }
  }

  /**
   * Automatically scrolling to page feature
   */
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollToPage = (targetPageId: string) => {
    const container = scrollContainerRef.current;
    const pageElement: HTMLElement | null = document.querySelector(
      'div[data-id="sp-page-' + targetPageId + '"]'
    );

    if (container && pageElement) {
      const containerHeight = container.clientHeight;
      const pageHeight = pageElement.offsetHeight;
      const pageOffsetTop = pageElement.offsetTop;
      const scrollPosition = pageOffsetTop - (containerHeight - pageHeight) / 2;

      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (pageId) {
      scrollToPage(pageId);
    }
  }, [pageId]);

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
      ref={scrollContainerRef}
      className={`flex flex-col ${className || ''} rounded-md pt-4
 overflow-y-scroll custom-scrollbar
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
  const panelRef = ref;
  const { bookId, pageId } = useParams<{ bookId: string; pageId: string }>();
  const dispatch = useDispatch();
  const deletePageFn = useDeletePage(Number(bookId));
  const addPageFn = useAddPage(Number(bookId));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        panelRef.current &&
        panelRef.current.contains(document.activeElement)
      ) {
        event.preventDefault();
        if (event.key === 'Backspace' || event.key === 'Delete') {
          const selectedPage = pages.find(
            (page) => page.pageId === Number(pageId)
          );

          if (selectedPage) {
            deletePageFn(selectedPage.pageId);
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
      className={`${className || ''} flex flex-col gap-4 overflow-y-auto z-20
      bg-primary-50 dark:bg-primary-950`}
    >
      <Pages className="p-2 flex-1" pages={pages} />
      <div className="flex justify-center pt-4">
        <ToolbarButton
          className="!rounded-full"
          tooltipContent="Ajouter une page"
          onClick={() => {
            addPageFn();
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
