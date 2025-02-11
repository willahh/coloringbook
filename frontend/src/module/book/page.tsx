import React, { useEffect /*, useState*/, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/common/hooks/useRedux';

import Layout from '../layout';
import { SpreadToolbar } from './ui/SpreadToolbar';
import SpreadViewerCanvas from './canvas/SpreadViewerCanvas';
import UnsavedChangesToast from './ui/UnchangedModificationsToast';
import SidePanel from './sidePanel/ui/SidePanel';
import BookHeader from './ui/BookHeader';
// import { BookContext } from './book.context';
import * as bookActions from './book.actions';
import { selectBook } from './book.state';
import { PagesPanel } from './ui/SidePanel/PagesPanel';
import { CanvasProvider } from './canvas/canvas.context';

const BookPage: React.FC = () => {
  let { bookId = 0, pageId = 1 } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  bookId = Number(bookId) || 0;
  pageId = Number(pageId) || 1;

  const dispatch = useAppDispatch();
  const { book, error, areLocalUpdatesSaved } = useAppSelector(selectBook);

  // Manage panels size
  const sidePanelRef = useRef<HTMLDivElement>(null);
  const pagesPanelRef = useRef<HTMLDivElement>(null);
  const [sidePanelWidth, setSidePanelWidth] = useState<number>(0);
  const [pagesPanelWidth, setPagesPanelWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidths = () => {
      if (sidePanelRef.current) {
        setSidePanelWidth(sidePanelRef.current.offsetWidth);
      }
      if (pagesPanelRef.current) {
        setPagesPanelWidth(pagesPanelRef.current.offsetWidth);
      }
    };
    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, [sidePanelRef, pagesPanelRef, sidePanelWidth]);

  useEffect(() => {
    dispatch(bookActions.fetchBookByIdAction({ bookId: bookId }));
  }, [bookId]);

  if (error) {
    console.error('TODO: Display an error message', error);
  }

  return (
    <>
      <Layout
        className={`w-full flex dark:bg-gray-700 bg-primary-400`}
        header={
          <BookHeader
            book={book}
            onBookNameEdit={(newName) => {
              dispatch(
                bookActions.editBookNameAction({ bookId, bookName: newName })
              );
            }}
          />
        }
      >
        <SidePanel ref={sidePanelRef} setSidePanelWidth={setSidePanelWidth} />
        <main className="flex flex-1 bg-primary-100 dark:bg-primary-900 flex-col overflow-hidden">
          {book.pages.length > 0 && (
            <CanvasProvider>
              <SpreadViewerCanvas
                pageId={pageId}
                pages={book.pages}
                sidePanelWidth={sidePanelWidth}
                pagesPanelWidth={pagesPanelWidth}
              />
            </CanvasProvider>
          )}
          <SpreadToolbar />
        </main>
        <PagesPanel
          ref={pagesPanelRef}
          className="w-24"
          pages={book.pages}
          addPageButtonClick={() => {}}
        ></PagesPanel>
      </Layout>
      <UnsavedChangesToast
        isModified={!areLocalUpdatesSaved}
        onSave={() => {
          dispatch(bookActions.saveBookAction({ bookId: bookId, book: book }));
        }}
      />
    </>
  );
};

export default BookPage;
