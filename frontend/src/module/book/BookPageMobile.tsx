import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@/common/store';
import * as bookActions from './BookActions';
import { selectBook } from './BookSlice';
import LayoutMobile from '@/common/components/LayoutMobile';
import SpreadViewerCanvas from './canvas/SpreadViewerCanvas';

import ErrorDialog from '@/common/components/ErrorDialog';
import LoadingScreen from '@/common/components/LoadingScreen';
import FooterTabsPanelMobile from './components/SidePanel/FooterTabsPanelMobile';
import BookHeaderMobile from './components/BookHeaderMobile';

const BookPageMobile: React.FC = () => {
  const { bookId = '0' } = useParams<{ bookId: string }>();
  const numericBookId = Number(bookId) || 0;

  const dispatch = useDispatch();
  const { book, error, isLoading } = useSelector(selectBook);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(bookActions.fetchBookByIdAction({ bookId: numericBookId }));
  }, [numericBookId, dispatch]);

  return (
    <LayoutMobile
      className={`w-screen h-screen overflow-hidden select-none
         dark:bg-gray-700 bg-primary-400 bg-radial-[at_0_300%] from-1% to-70% from-secondary-100 to-primary-100 dark:from-secondary-900 dark:to-primary-900 dark:brightness-125`}
      header={
        <BookHeaderMobile
          book={book}
          onBookNameEdit={(newName) => {
            dispatch(
              bookActions.editBookNameAction({
                bookId: numericBookId,
                bookName: newName,
              })
            );
          }}
        />
      }
      footer={<FooterTabsPanelMobile  />}
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
          {book?.pages.length > 0 && (
            <SpreadViewerCanvas
              pages={book.pages}
            />
          )}
        </>
      ) : (
        <LoadingScreen isLoading={isLoading} />
      )}
    </LayoutMobile>
  );
};

export default BookPageMobile;
