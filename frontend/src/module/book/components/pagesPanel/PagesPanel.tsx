import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FixedSizeList } from 'react-window';
import { PlusIcon } from '@heroicons/react/24/outline';

import type { Page } from '@apptypes/book';
import { ToolbarButton } from '../ToolbarButton';
import { useDispatch, useSelector } from '@/common/store';
import { PageService } from '@/services/PageService';
import * as BookActions from '../../BookActions';
import { BookPageParams } from '@/common/interfaces';
import { selectBook, selectBookFormat, selectBookPages } from '../../BookSlice';
import { useServices } from '@/common/contexts/ServiceContext';
import { trackBookEvent } from '@/common/utils/analyticsEvents';
import PageComponent from './PageComponent';
import useDeletePage from './useDeletePage';
import { BookFormat } from '@/common/types/book.enum';

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
  const bookFormat = useSelector(selectBookFormat);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<FixedSizeList>(null);
  const selectedPageId = pageId ? Number(pageId) : -1;
  const useSpread = false;
  let spreads: Page[][] = [];

  if (pages.length > 0) {
    spreads = useSpread
      ? bookDataService.transformPagesToSpread(pages)
      : [pages];
  }

  const itemHeight =
    bookFormat === BookFormat.A4_PAYSAGE
      ? 110
      : bookFormat === BookFormat.A4_PORTRAIT
      ? 160
      : bookFormat === BookFormat.CARRE
      ? 140
      : 0;

  console.log('#01 bookFormat', bookFormat);
  console.log('#01 itemHeight', itemHeight);
  // const itemHeight = bookFormat. 180; // Ajustez après mesure

  const renderPage = useCallback(
    ({ index, style }) => {
      const page = spreads[0][index];
      return (
        <div style={style} className="px-2">
          <PageComponent
            bookId={Number(bookId)}
            page={page}
            selected={page.pageId === selectedPageId}
          />
        </div>
      );
    },
    [spreads, selectedPageId, bookId]
  );

  useEffect(() => {
    if (pageId && listRef.current) {
      const targetIndex = pages.findIndex((p) => p.pageId === Number(pageId));
      if (targetIndex !== -1) {
        listRef.current.scrollToItem(targetIndex, 'smart');
      }
    }
  }, [pageId, pages]);

  return (
    <div
      ref={scrollContainerRef}
      className={`${
        className || ''
      } flex flex-col rounded-md pt-4 overflow-hidden`}
      style={{ maxHeight: 'calc(100vh - 10em)' }}
    >
      <FixedSizeList
        height={scrollContainerRef.current?.clientHeight || 600}
        width="100%"
        itemCount={pages.length}
        itemSize={itemHeight}
        overscanCount={5}
        outerRef={scrollContainerRef}
        ref={listRef} // Ajout du ref pour contrôler le scroll
      >
        {renderPage}
      </FixedSizeList>
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
