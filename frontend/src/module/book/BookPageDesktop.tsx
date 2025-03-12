import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@/common/store';
import Layout from '@/common/components/Layout';
import SpreadViewerCanvas from './canvas/SpreadViewerCanvas';
import SidePanel from './sidePanel/SidePanel';
import * as bookActions from './BookActions';
import { selectBook } from './BookSlice';
import { PagesPanel } from './components/SidePanel/pagesPanel/PagesPanel';
import BookToolbar from './components/BookToolbar';
import LoadingScreen from '@/common/components/LoadingScreen';
import ErrorDialog from '@/common/components/ErrorDialog';
import { backgroundRadialStyles } from '@/common/utils/backgroundStyles';
import BookFooterDesktop from './components/BookFooterDesktop';
// import LayerPanel from './components/LayerPanel';
import useCanvasContext from './useCanvasContext';
import VectorizerComponent from './components/vectorizer/VectorizerComponent';

const BookPageDesktop: React.FC = () => {
  let { bookId = 0 /*, pageId = 1 */ } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  bookId = Number(bookId) || 0;

  const dispatch = useDispatch();
  const { book, error, isLoading } = useSelector(selectBook);
  const { canvas } = useCanvasContext();

  const sidePanelRef = useRef<HTMLDivElement>(null);
  const pagesPanelRef = useRef<HTMLDivElement>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(true);

  useEffect(() => {
    dispatch(bookActions.fetchBookByIdAction({ bookId: bookId }));
  }, [bookId]);

  const handleCanvasUpdate = () => {
    canvas?.renderAll();
  };

  return (
    <Layout
      className={`w-screen h-screen overflow-hidden ${backgroundRadialStyles}`}
      header={
        <BookFooterDesktop
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
          <VectorizerComponent />
          <SidePanel ref={sidePanelRef} className="relative z-20" />
          {book.pages.length > 0 && <SpreadViewerCanvas pages={book.pages} />}
          {/* <LayerPanel canvas={canvas} onUpdateCanvas={handleCanvasUpdate} /> */}
          <div>
            <PagesPanel
              ref={pagesPanelRef}
              className="w-16 md:w-24 xl:w-30 h-full border-r border-primary-200 dark:border-primary-800"
              pages={book.pages}
              addPageButtonClick={() => {}}
            ></PagesPanel>
          </div>
          {/* <SpreadToolbar /> */}
        </>
      ) : (
        <LoadingScreen isLoading={isLoading} />
      )}
    </Layout>
  );
};

export default BookPageDesktop;
