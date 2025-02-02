import React, { useState, createContext, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { IBook, Page } from '@/domain/book';
import { PageService } from '@/services/PageService';

/* 
 FIXME: Export default !!
 import { SpreadToolbar } from './SpreadViewerCanvas/ui/SpreadToolbar';
 => 
 import SpreadToolbar from './SpreadViewerCanvas/ui/SpreadToolbar';
*/
import Layout from '../layout';
import { SpreadToolbar } from './SpreadViewerCanvas/ui/SpreadToolbar';
import { SideToolbar } from './SidePanel/SideToolbar';
import { ColorPanel } from './SidePanel/ColorPanel';
import { SidePanel } from './SidePanel/SidePanel';
import GraphicsPanel from './SidePanel/GraphicsPanel';
import { TemplatePanel } from './SidePanel/TemplatePanel';
import { PagesPanel } from './SidePanel/PagesPanel';
import SpreadViewerCanvas from './SpreadViewerCanvas/SpreadViewerCanvas';
import { VerticalSeparator } from './SidePanel/VerticalSeparator';
import { BookService } from '@/services/BookService';
import UnsavedChangesToast from './SpreadViewerCanvas/ui/UnchangedModificationsToast';
import Header from '@/components/Header';
import BreadCrumb from '@/components/BreadCrumb';
import InlineEdit from '@/components/InlineEdit';
import ImageConverter from './SidePanel/ImageConverter';

interface CanvasContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  book?: IBook | null;
  pageParams: {
    bookId: string;
    pageId?: string;
  };
  isModified: boolean;
}

export const BookPageContext = createContext<CanvasContextType>({
  canvas: null,
  setCanvas: () => {},
  book: null,
  pageParams: {
    bookId: '',
  },
  setPages: function (pages: React.SetStateAction<Page[]>): void {
    throw new Error(`Function not implemented. ${pages}`);
  },
  isModified: false,
});

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
            href: '/books',
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
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [book, setBook] = useState<IBook | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [isModified, setIsModified] = useState(false);
  console.log('#2 isModified', isModified);
  const [, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

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

  const handleAddPageButtonClick = () => {
    const newPage: Page = {
      pageId: 10,
      pageNumber: 10,
      aspectRatio: { width: 1, height: 1 },
      elements: [],
    };
    if (book) {
      const bookNew: IBook = PageService.addPage(book, newPage);
      setPages(bookNew.pages);
      setIsModified(true);
    }
  };
  const handleDeleteButtonClick = (event: React.MouseEvent, pageId: number) => {
    event.preventDefault();

    if (window.confirm('Confirmer la suppression de la page ?')) {
      if (book) {
        const bookNew: IBook = PageService.deletePage(book, pageId);
        setPages(bookNew.pages);
        setIsModified(true);
      }
    }
  };

  const handleSave = useCallback(async () => {
    console.log('handleSave');
    try {
      const data = await BookService.updateBook(bookId, { pages: pages });
      if (!data.error) {
        console.log('Book saved successfully:', data);
        setIsModified(false);
      } else {
        if (data.message) {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error('Error saving book:', error);
    }
  }, [bookId, pages]);

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
    }
  };

  return (
    <BookPageContext.Provider
      value={{ canvas, setCanvas, book, pageParams, setPages, isModified }}
    >
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
          className="flex flex-row w-3/12 min-w-96 max-w-[500px] bg-primary-100 dark:bg-primary-900 shadow-black z-10
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
            <GraphicsPanel />
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
        <main className="flex flex-1 bg-primary-50 dark:bg-primary-950 flex-col">
          <SpreadViewerCanvas pages={pages} />
          <SpreadToolbar />
        </main>
      </Layout>
      <UnsavedChangesToast isModified={isModified} onSave={handleSave} />
    </BookPageContext.Provider>
  );
};

export default BookPage;
