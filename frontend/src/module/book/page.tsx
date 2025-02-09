import React, { useContext, useEffect /*, useState*/ } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

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
import BookHeader from './ui/BookHeader';
// import { handleRectangleClick } from './canvas/canvas.events';
import { BookContext } from './book.context';
import { RootState } from '@/store';
import * as bookActions from './book.actions';
// import { Page } from '@/types/book';
// import { BookFormatHelper } from '@/utils/book.utils';
// import { BookFormat } from '@/types/book.enum';
import { PageService } from '@/services/page.service';
import { selectBook } from './book.state';
// import { PageService } from '@/services/page.service';

const BookPage: React.FC = () => {
  // Page params
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
              onGraphicAssetItemClick={(graphicAsset) => {
                dispatch(
                  bookActions.AddGraphicAssetToPageAction({
                    graphicAsset: graphicAsset,
                    pageId: pageId,
                  })
                );
              }}
            />
            <ImageConverter />
            <VerticalSeparator />
            <ColorPanel className="" />
          </div>
          <PagesPanel
            pages={book.pages}
            addPageButtonClick={() => {
              const newPage = PageService.getNewPage(book.pages);
              dispatch(
                bookActions.addPageAction({ book: book, page: newPage })
              );
            }}
            onDeleteButtonClick={() => {
              dispatch(bookActions.deletePageAction({ pageId: pageId }));
            }}
          />
          <SideToolbar
            onRectangleClick={() => {
              if (canvas) {
                console.error('TODO: implement this handler');
                // const image = PageService.getImageData(canvas);
                // dispatch(bookAction.updateBookAction({ book: {} }));
              }

              // PageService.updateThumbImageData(pages, canvas, pageId);
              // dispatch()
              //  const pagesNew = PageService.updateThumbImageData(pages, canvas, pageId);
              //   console.log('#4 pagesNew:', pagesNew);
              //   console.log('#4 call dispatch SET_PAGES');
              //   dispatch({ type: 'SET_PAGES', payload: pagesNew });
              //   dispatch({ type: 'SET_MODIFIED', payload: true });
              // handleRectangleClick(dispatch, canvas, book.pages, pageId);
            }}
          />
        </SidePanel>
        <main className="flex flex-1 bg-primary-100 dark:bg-primary-950 flex-col">
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
