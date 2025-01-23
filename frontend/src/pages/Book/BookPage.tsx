import React, { useState, createContext } from 'react';
import Layout from '../layout';
import * as fabric from 'fabric';

import { BookFormat } from '@/domain/book.enum';
import { SpreadToolbar } from './mainPanel/SpreadToolbar';
import { SideToolbar } from './SidePanel/SideToolbar';
import { ColorPanel } from './SidePanel/ColorPanel';
import { SidePanel } from './SidePanel/SidePanel';
import { GraphicsPanel } from './SidePanel/GraphicsPanel';
import { TemplatePanel } from './SidePanel/TemplatePanel';
import { PagesPanel } from './SidePanel/PagesPanel';
import SpreadCanvas from './mainPanel/MainSpread';
import { VerticalSeparator } from './SidePanel/VerticalSeparator';
import { IBook } from '@/domain/book';
// import { AspectRatio } from '@radix-ui/themes';
// import { text } from 'stream/consumers';

// Create a context for the canvas
interface CanvasContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  bookData: IBook;
}

export const CanvasContext = createContext<CanvasContextType>({
  canvas: null,
  setCanvas: () => {},
  bookData: null as unknown as IBook,
});

const BookPage: React.FC = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const bookData: IBook = {
    id: 89,
    name: 'Book 1',
    format: BookFormat.A4_PORTRAIT,
    coverImage: 'cover_1737449702251-826030765.jpg',
    pageCount: 12,
    pages: [
      {
        pageNumber: 1,
        AspectRatio: { w: 210, h: 297 },
        elements: [
          { type: 'image', x: 0, y: 0, w: 30, h: 30, attr: { imageData: '' } },
          {
            type: 'rectangle',
            x: 21,
            y: 0,
            w: 20,
            h: 20,
            attr: { fill: 'red', stroke: 'transparent', strokeWidth: 0 },
          },
          {
            type: 'rectangle',
            x: 41,
            y: 0,
            w: 20,
            h: 20,
            attr: { fill: 'blue', stroke: 'transparent', strokeWidth: 0 },
          },
          {
            type: 'circle',
            x: 61,
            y: 0,
            w: 20,
            h: 20,
            attr: { fill: 'transparent', stroke: '#000', strokeWidth: 1 },
          },
          {
            type: 'triangle',
            x: 0,
            y: 21,
            w: 20,
            h: 20,
            attr: { fill: 'transparent', stroke: '#000', strokeWidth: 1 },
          },
          {
            type: 'text',
            x: 0,
            y: 41,
            w: 50,
            h: 10,
            attr: {
              fill: 'transparent',
              stroke: '#000',
              strokeWidth: 1,
              text: {
                text: 'Hello',
                fontSize: 12,
                textAlign: 'left',
                color: 'black',
              },
            },
          },
        ],
      },
      {
        pageNumber: 1,
        AspectRatio: { w: 210, h: 297 },
        elements: [
          { type: 'image', x: 0, y: 0, w: 30, h: 30, attr: { imageData: '' } },
          {
            type: 'rectangle',
            x: 21,
            y: 0,
            w: 20,
            h: 20,
            attr: { fill: 'red', stroke: 'transparent', strokeWidth: 0 },
          },
          {
            type: 'rectangle',
            x: 41,
            y: 0,
            w: 20,
            h: 20,
            attr: { fill: 'blue', stroke: 'transparent', strokeWidth: 0 },
          },
          {
            type: 'circle',
            x: 61,
            y: 0,
            w: 20,
            h: 20,
            attr: { fill: 'transparent', stroke: '#000', strokeWidth: 1 },
          },
          {
            type: 'triangle',
            x: 0,
            y: 21,
            w: 20,
            h: 20,
            attr: { fill: 'transparent', stroke: '#000', strokeWidth: 1 },
          },
          {
            type: 'text',
            x: 0,
            y: 41,
            w: 50,
            h: 10,
            attr: {
              fill: 'transparent',
              stroke: '#000',
              strokeWidth: 1,
              text: {
                text: 'Hello',
                fontSize: 12,
                textAlign: 'left',
                color: 'black',
              },
            },
          },
        ],
      },
    ],
  };

  return (
    <CanvasContext.Provider value={{ canvas, setCanvas, bookData }}>
      <Layout className={`w-full flex`} showHeader={true}>
        <SidePanel
          className="flex flex-row bg-primary-900 w-72 shadow-black z-10
        shadow-[3px_0_10px_-4px_rgb aa(0,0,0,0.3)]"
        >
          <div
            className={`flex-1 border-r border-primary-950 
            overflow-x-hidden overflow-y-auto
            `}
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <PagesPanel />
            <VerticalSeparator />
            <TemplatePanel className="" />
            <VerticalSeparator />
            <GraphicsPanel className="" />
            <VerticalSeparator />
            <ColorPanel className="" />
          </div>
          <SideToolbar />
        </SidePanel>
        <main className="flex flex-1 bg-slate-900 flex-col">
          <SpreadCanvas />
          <SpreadToolbar />
        </main>
      </Layout>
    </CanvasContext.Provider>
  );
};

export default BookPage;
