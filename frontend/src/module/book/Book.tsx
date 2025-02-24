import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@/common/store';
import Layout from '../layout';
import SpreadViewerCanvas from './canvas/SpreadViewerCanvas';
import UnsavedChangesToast from './components/UnchangedModificationsToast';
import SidePanel from './sidePanel/SidePanel';
import BookHeader from './components/BookHeader';
import * as bookActions from './Book.actions';
import { selectBook } from './Book.slice';
import { PagesPanel } from './components/SidePanel/pagesPanel/PagesPanel';
import BookToolbar from './bookToolbar/BookToolbar';

const BookPage: React.FC = () => {
  let { bookId = 0, pageId = 1 } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  bookId = Number(bookId) || 0;
  pageId = Number(pageId) || 1;

  const dispatch = useDispatch();
  const { book, error, areLocalUpdatesSaved } = useSelector(selectBook);

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
        <BookToolbar />
        <PagesPanel
          ref={pagesPanelRef}
          className="w-16 md:w-24 xl:w-30 border-r border-primary-200 dark:border-primary-800"
          pages={book.pages}
          addPageButtonClick={() => {}}
        ></PagesPanel>
        <SidePanel ref={sidePanelRef} setSidePanelWidth={setSidePanelWidth} />
        <main
          className={`flex flex-1  flex-col overflow-hidden
          bg-radial-[at_1%_-100%] from-secondary-100 to-primary-100 dark:from-secondary-900 dark:to-primary-900
          `}
        >
          {book.pages.length > 0 && (
            <SpreadViewerCanvas
              // pageId={pageId}
              pages={book.pages}
              sidePanelWidth={sidePanelWidth}
              pagesPanelWidth={pagesPanelWidth}
            />
          )}
          {/* <SpreadToolbar /> */}
        </main>
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
