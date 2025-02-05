import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
/* 
 FIXME: Export default !!
 import { SpreadToolbar } from './SpreadViewerCanvas/ui/SpreadToolbar';
 => 
 import SpreadToolbar from './SpreadViewerCanvas/ui/SpreadToolbar';
*/
import Layout from '../layout';
import { SpreadToolbar } from './ui/SpreadToolbar';
import { SideToolbar } from './ui/SidePanel/SideToolbar';
import { ColorPanel } from './ui/SidePanel/ColorPanel';
import { SidePanel } from './ui/SidePanel/SidePanel';
import GraphicsPanel from './ui/SidePanel/GraphicsPanel';
import { PagesPanel } from './ui/SidePanel/PagesPanel';
import SpreadViewerCanvas from './canvas/SpreadViewerCanvas';
import { VerticalSeparator } from './ui/SidePanel/VerticalSeparator';
import UnsavedChangesToast from './ui/UnchangedModificationsToast';
import ImageConverter from './ui/SidePanel/ImageConverter';
import { usePageManagement } from './hooks/usePageManagement';
import BookHeader from './ui/BookHeader';

import {
  handleGraphicAssetItemClick,
  handleRectangleClick,
} from './canvas/canvas.events';
import { editBookName } from './book.actions';
import { BookContext } from './book.context';
import { BookService } from '@/services/book.service';

const BookPage: React.FC = () => {
  console.log('#4 BookPage');

  // Page params
  let { bookId = 0, pageId = 1 } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  bookId = Number(bookId) | 0;
  pageId = Number(pageId) | 1;

  // Use context for dispatch
  const { state, dispatch, canvas } = useContext(BookContext);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Move to an actionCreator
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const book = await BookService.getBook(bookId);
        const { book: newBook, isModified } = BookService.prepareBookData(book);
        dispatch({ type: 'SET_BOOK', payload: newBook });
        dispatch({ type: 'SET_MODIFIED', payload: isModified });
      } catch (err) {
        setError(`Erreur lors du chargement du livre ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId]); // Do not add dispatch in dependency to prevent infinite loop !

  // States
  const { handleSave, handleAddPageButtonClick, handleDeleteButtonClick } =
    usePageManagement(bookId, dispatch);

  console.log('#4 state', state);

  // Handlers
  // TODO
  // const handleOnEdit = async (book: Book | null, newValue: string) => {
  //   console.log('onEdit', newValue);

  //   if (book) {
  //     const newBook = {
  //       ...book,
  //       name: newValue,
  //     };
  //     const responseData = await BookService.updateBook(book.id, newBook);
  //     if (!responseData.error) {
  //       setIsModified(false);
  //       // setBook(newBook); // TODO
  //     } else {
  //       if (responseData.message) {
  //         alert(responseData.message);
  //       }
  //     }
  //   }
  // };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Layout
        className={`w-full flex`}
        header={
          <BookHeader
            book={state.book}
            onBookNameEdit={(newName) => {
              dispatch(editBookName(bookId, newName));
            }}
          />
        }
      >
        <SidePanel
          className="flex flex-row w-3/12 min-w-96 max-w-[500px] bg-primary-50 dark:bg-primary-900 shadow-black z-10
        shadow-[3px_0_10px_-4px_rgb aa(0,0,0,0.3)]"
        >
          <div
            className={`flex-1 border-r border-primary-200 dark:border-primary-800
            overflow-x-hidden overflow-y-auto
            `}
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            {/* <TemplatePanel className="" /> */}
            {/* <VerticalSeparator /> */}
            <GraphicsPanel
              onGraphicAssetItemClick={(asset) => {
                handleGraphicAssetItemClick(
                  dispatch,
                  asset,
                  state.book,
                  canvas,
                  state.book.pages,
                  pageId
                );
              }}
            />
            <ImageConverter />
            <VerticalSeparator />
            <ColorPanel className="" />
          </div>
          <PagesPanel
            pages={state.book.pages}
            addPageButtonClick={handleAddPageButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
          <SideToolbar
            onRectangleClick={() => {
              handleRectangleClick(dispatch, canvas, state.book.pages, pageId);
            }}
          />
        </SidePanel>
        <main className="flex flex-1 bg-primary-100 dark:bg-primary-950 flex-col">
          <SpreadViewerCanvas pages={state.book.pages} />
          <SpreadToolbar />
        </main>
      </Layout>
      <UnsavedChangesToast
        isModified={state.isModified}
        onSave={() => {
          handleSave(state.book.pages);
        }}
      />
    </>
  );
};

export default BookPage;
