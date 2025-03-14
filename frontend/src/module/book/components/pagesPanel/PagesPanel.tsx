import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

import type { Page } from '@apptypes/book';
import { ToolbarButton } from '../ToolbarButton';
import { useDispatch, useSelector } from '@/common/store';
import { PageService } from '@/services/PageService';
import * as BookActions from '../../BookActions';
import { BookPageParams } from '@/common/interfaces';
import { selectBookPages } from '../../BookSlice';
import { useServices } from '@/common/contexts/ServiceContext';
import { trackBookEvent } from '@/common/utils/analyticsEvents';
import PageComponent from './PageComponent';
import useDeletePage from './useDeletePage';


interface PagesProps {
  className?: string;
  pages: Page[];
  onDeleteButtonClick?: (pageId: number) => void;
}


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
