import React, { useContext, useEffect /*, useState*/ } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/common/hooks/useRedux';

import Layout from '../layout';
import { SpreadToolbar } from './ui/SpreadToolbar';
import SpreadViewerCanvas from './canvas/SpreadViewerCanvas';
import UnsavedChangesToast from './ui/UnchangedModificationsToast';
import SidePanel from './sidePanel/ui/SidePanel';
import BookHeader from './ui/BookHeader';
import { BookContext } from './book.context';
import * as bookActions from './book.actions';
import { selectBook } from './book.state';

const BookPage: React.FC = () => {
  let { bookId = 0, pageId = 1 } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  bookId = Number(bookId) | 0;
  pageId = Number(pageId) | 1;

  const dispatch = useAppDispatch();
  const { book, error, areLocalUpdatesSaved } = useAppSelector(selectBook);
  const { canvas } = useContext(BookContext);

  useEffect(() => {
    dispatch(bookActions.fetchBookByIdAction({ bookId: bookId }));
  }, [bookId]);

  if (error) {
    console.error('TODO: Display an error message', error);
  }

  return (
    <>
      <Layout
        className={`w-full flex`}
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
        <SidePanel />
        <main className="flex flex-1 bg-primary-100 dark:bg-primary-900 flex-col">
          {book.pages.length > 0 && <SpreadViewerCanvas pages={book.pages} />}
          <SpreadToolbar />
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
