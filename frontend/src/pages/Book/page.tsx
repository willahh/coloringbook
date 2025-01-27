import React, { useState, createContext } from 'react';
import Layout from '../layout';
import * as fabric from 'fabric';
import { useParams } from 'react-router-dom';

import { SpreadToolbar } from './spreadViewerCanvas/ui/SpreadToolbar';
import { SideToolbar } from './sidePanel/SideToolbar';
import { ColorPanel } from './sidePanel/ColorPanel';
import { SidePanel } from './sidePanel/SidePanel';
import { GraphicsPanel } from './sidePanel/GraphicsPanel';
import { TemplatePanel } from './sidePanel/TemplatePanel';
import { PagesPanel } from './sidePanel/PagesPanel';
import SpreadViewerCanvas from './spreadViewerCanvas/SpreadViewerCanvas';
import { VerticalSeparator } from './sidePanel/VerticalSeparator';
import { IBook, Page } from '@/domain/book';
import { bookData } from '@/mock/BookData';
import { PageService } from '@/services/PageService';

interface CanvasContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  bookData: IBook;
  pageParams: {
    bookId: string;
    pageId?: string;
  };
}

export const BookPageContext = createContext<CanvasContextType>({
  canvas: null,
  setCanvas: () => {},
  bookData: null as unknown as IBook,
  pageParams: {
    bookId: '',
  },
  setPages: function (pages: React.SetStateAction<Page[]>): void {
    throw new Error(`Function not implemented. ${pages}`);
  },
});

const BookPage: React.FC = () => {
  console.log('BookPage');
  const { bookId = '', pageId = '1' } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  const pageParams = { bookId, pageId };

  // States
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [pages, setPages] = useState(bookData.pages);

  // Handlers
  const handleAddPageButtonClick = (e: React.MouseEvent) => {
    console.log('handlePageButtonClick', e);

    const newPage: Page = {
      pageId: 10,
      pageNumber: 10,
      aspectRatio: { width: 1, height: 1 },
      elements: [],
    };
    const book: IBook = PageService.addPage(bookData, newPage);
    setPages(book.pages);
  };

  return (
    <BookPageContext.Provider
      value={{ canvas, setCanvas, bookData, pageParams, setPages }}
    >
      <Layout className={`w-full flex`} showHeader={true}>
        <SidePanel
          className="flex flex-row bg-primary-900 w-80 shadow-black z-10
        shadow-[3px_0_10px_-4px_rgb aa(0,0,0,0.3)]"
        >
          <div
            className={`flex-1 border-r border-primary-950 
            overflow-x-hidden overflow-y-auto
            `}
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <TemplatePanel className="" />
            <VerticalSeparator />
            <GraphicsPanel className="" />
            <VerticalSeparator />
            <ColorPanel className="" />
          </div>
          <PagesPanel
            pages={pages}
            addPageButtonClick={handleAddPageButtonClick}
          />
          <SideToolbar />
        </SidePanel>
        <main className="flex flex-1 bg-slate-900 flex-col">
          <SpreadViewerCanvas pages={pages} />
          <SpreadToolbar />
        </main>
      </Layout>
    </BookPageContext.Provider>
  );
};

export default BookPage;
