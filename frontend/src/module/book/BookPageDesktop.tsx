import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@/common/store';
import Layout from '../layout';
import SpreadViewerCanvas from './canvas/SpreadViewerCanvas';
import SidePanel from './sidePanel/SidePanel';
import BookFooter from './components/BookFooter';
import * as bookActions from './BookActions';
import { selectBook } from './BookSlice';
import { PagesPanel } from './components/SidePanel/pagesPanel/PagesPanel';
import BookToolbar from './components/BookToolbar';
import LoadingScreen from '@/common/components/LoadingScreen';
import ErrorDialog from '@/common/components/ErrorDialog';
import { backgroundRadialStyles } from '@/common/utils/backgroundStyles';

const BookPageDesktop: React.FC = () => {
  let { bookId = 0 /*, pageId = 1 */ } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  bookId = Number(bookId) || 0;

  const dispatch = useDispatch();
  const { book, error, isLoading } = useSelector(selectBook);

  const sidePanelRef = useRef<HTMLDivElement>(null);
  const pagesPanelRef = useRef<HTMLDivElement>(null);
  const [sidePanelWidth, setSidePanelWidth] = useState<number>(0);
  const [pagesPanelWidth, setPagesPanelWidth] = useState<number>(0);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(true);

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

  return (
    <Layout
      className={`w-screen h-screen overflow-hidden ${backgroundRadialStyles}`}
      header={
        <BookFooter
          book={book}
          onBookNameEdit={(newName) => {
            dispatch(
              bookActions.editBookNameAction({ bookId, bookName: newName })
            );
          }}
        />
      }
    >
      {error ? (
        <ErrorDialog
          title={`Erreur ${error.status}`}
          message={error.message}
          isOpen={isErrorDialogOpen}
          onClose={() => {
            setIsErrorDialogOpen(false);
          }}
        />
      ) : !isLoading ? (
        <>
          <BookToolbar />
          <PagesPanel
            ref={pagesPanelRef}
            className="w-16 md:w-24 xl:w-30 border-r border-primary-200 dark:border-primary-800"
            pages={book.pages}
            addPageButtonClick={() => {}}
          ></PagesPanel>
          <SidePanel
            ref={sidePanelRef}
            setSidePanelWidth={setSidePanelWidth}
            className="relative z-20"
          />

          {book.pages.length > 0 && (
            <SpreadViewerCanvas
              pages={book.pages}
              sidePanelWidth={sidePanelWidth}
              pagesPanelWidth={pagesPanelWidth}
            />
          )}
          {/* <SpreadToolbar /> */}
        </>
      ) : (
        <LoadingScreen isLoading={isLoading} />
      )}
    </Layout>
  );
};

export default BookPageDesktop;
