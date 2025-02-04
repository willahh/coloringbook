import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { IBook, Obj, Page } from '@/domain/book';
import { PageService } from '@/services/page.service';

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
// import { TemplatePanel } from './ui/SidePanel/TemplatePanel';
import { PagesPanel } from './ui/SidePanel/PagesPanel';
import SpreadViewerCanvas from './canvas/SpreadViewerCanvas';
import { VerticalSeparator } from './ui/SidePanel/VerticalSeparator';
import { BookService } from '@/services/book.service';
import UnsavedChangesToast from './ui/UnchangedModificationsToast';
import Header from '@/components/Header';
import BreadCrumb from '@/components/BreadCrumb';
import InlineEdit from '@/components/InlineEdit';
import ImageConverter from './ui/SidePanel/ImageConverter';
import { GraphicAsset } from '@/domain/graphic-asset.entity';
import { ElementService } from '@/services/element.service';
import { useBook } from './hooks/useBook';
import { usePageManagement } from './hooks/usePageManagement';
import { useUIState } from './hooks/useUIState';
import { BookProvider } from './book.context';

const BookHeader: React.FC<{
  book: IBook | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  return (
    <Header>
      <BreadCrumb
        pages={[
          {
            current: false,
            href: '/library',
            content: 'Bibliothèque',
            description: 'Accéder à ma bibliothèque de livres',
          },
          ...(book
            ? [
                {
                  current: true,
                  href: '/books/' + book.id,
                  content: (
                    <InlineEdit value={book.name} onEdit={onBookNameEdit} />
                  ),
                },
              ]
            : []),
        ]}
      />
    </Header>
  );
};

const BookPage: React.FC = () => {
  console.log('BookPage');

  // Page params
  const { bookId = '', pageId = '1' } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  const pageParams = { bookId, pageId };

  // States
  // const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [book, setBook] = useState<IBook | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [isModified, setIsModified] = useState(false);
  const [refreshGraphics] = useState(false);

  const [, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const { state, dispatch, isLoading, error } = useBook(bookId);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const { handleSave, handleAddPageButtonClick, handleDeleteButtonClick } =
    usePageManagement(bookId, dispatch);
  const { setModified, setRefreshGraphics } = useUIState(dispatch);

  // Effects
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const book = await BookService.getBook(bookId);
        const { book: newBook, isModified } = BookService.prepareBookData(book);

        setIsLoading(true);
        setBook(newBook);
        setPages(newBook.pages);
        setIsModified(isModified);
      } catch (err) {
        setError(`Erreur lors du chargement du livre ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  // Handlers
  const handleOnEdit = async (book: IBook | null, newValue: string) => {
    console.log('onEdit', newValue);

    if (book) {
      const newBook = {
        ...book,
        name: newValue,
      };
      const responseData = await BookService.updateBook(
        String(book.id),
        newBook
      );
      if (!responseData.error) {
        setIsModified(false);
        setBook(newBook);
      } else {
        if (responseData.message) {
          alert(responseData.message);
        }
      }
    }
  };

  const handleGraphicAssetItemClick = (asset: GraphicAsset) => {
    console.log('handleGraphicAssetItemClick', asset);
    const element: Obj | null = ElementService.elementFromGraphicAsset(asset);
    if (!element) {
      console.error('Failed to create element from graphic asset');
      return;
    }

    if (book && canvas) {
      const updatedBook: IBook = { ...book };
      updatedBook.pages = pages;

      const updatedBook2 = ElementService.add(
        updatedBook,
        element,
        Number(pageId)
      );
      setPages(updatedBook2.pages);
      setIsModified(true);
    }
  };

  const onRectangleClick = () => {
    console.log('onRectangleClick');

    if (canvas) {
      /*
       * [TODO]
       *  - GO TO PAGE 1
       *  Screen => save to page 1 thumb
       *  - GO TO PAGE 2
       *  Screen ...
       *  ...
       *
       * ------------------------------------------------------------------------
       *
       * Ou alors :
       *  - Faire un nouveau div qui prend tout l'écran.
       *  - Faire un rendu du canva
       *  - Faire la capture depuis ce div en plein écran.
       *  - Le div peut être en opacité 0 le temps de l'opération ?
       * */
      const pagesNew = PageService.updateThumbImageData(
        pages,
        canvas,
        Number(pageId)
      );
      setPages(pagesNew);
      setIsModified(true);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BookProvider dispatch={dispatch}>
      <Layout
        className={`w-full flex`}
        header={
          <BookHeader
            book={book}
            onBookNameEdit={(newName) => {
              handleOnEdit(book, newName);
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
              onGraphicAssetItemClick={handleGraphicAssetItemClick}
            />
            <ImageConverter />
            <VerticalSeparator />
            <ColorPanel className="" />
          </div>
          <PagesPanel
            pages={pages}
            addPageButtonClick={handleAddPageButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
          <SideToolbar onRectangleClick={onRectangleClick} />
        </SidePanel>
        <main className="flex flex-1 bg-primary-100 dark:bg-primary-950 flex-col">
          <SpreadViewerCanvas pages={pages} />
          <SpreadToolbar />
        </main>
      </Layout>
      <UnsavedChangesToast
        isModified={isModified}
        onSave={() => {
          handleSave(pages);
        }}
      />
    </BookProvider>
  );
};

export default BookPage;
