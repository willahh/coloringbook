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
import { IBook } from '@/domain/book';
import { bookData } from '@/mock/BookData';

interface CanvasContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  bookData: IBook;
  pageParams: {
    bookId: string;
    pageId?: string;
  };
}

export const CanvasContext = createContext<CanvasContextType>({
  canvas: null,
  setCanvas: () => {},
  bookData: null as unknown as IBook,
  pageParams: {
    bookId: '',
  },
});

const Page: React.FC = () => {
  console.log('Page');
  const { bookId = '', pageId = '1' } = useParams<{
    bookId: string;
    pageId?: string;
  }>();
  const pageParams = { bookId, pageId };
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const handleAddPageButtonClick = (e: React.MouseEvent) => {
    console.log('handlePageButtonClick', e);
  };

  
  return (
    <CanvasContext.Provider value={{ canvas, setCanvas, bookData, pageParams }}>
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
            pages={bookData.pages}
            addPageButtonClick={handleAddPageButtonClick}
          />
          <SideToolbar />
        </SidePanel>
        <main className="flex flex-1 bg-slate-900 flex-col">
          <SpreadViewerCanvas />
          <SpreadToolbar />
        </main>
      </Layout>
    </CanvasContext.Provider>
  );
};

export default Page;
