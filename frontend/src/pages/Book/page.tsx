import React, { useState, createContext } from 'react';
import Layout from '../layout';
import * as fabric from 'fabric';

import { BookFormat } from '@/domain/book.enum';
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

const Page: React.FC = () => {
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
        aspectRatio: { width: 210, height: 297 },
        elements: [
          // { type: 'image', x: 0, y: 0, w: 30, h: 30, attr: { imageData: '' } },
          // { type: 'svg',
          //   x: 21,
          //   y: 0,
          //   w: 20,
          //   h: 20,
          //   attr: { svgContent: '' } },
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
              text: 'Hello',
              fontSize: 12,
              textAlign: 'left',
              color: 'black',
            },
          },
        ],
      },
      {
        pageNumber: 1,
        aspectRatio: { width: 210, height: 297 },
        elements: [
          // { type: 'image', x: 0, y: 0, w: 30, h: 30, attr: { imageData: '' } },
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
              text: 'Hello',
              fontSize: 12,
              textAlign: 'left',
              color: 'black',
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
          <SpreadViewerCanvas />
          <SpreadToolbar />
        </main>
      </Layout>
    </CanvasContext.Provider>
  );
};

export default Page;
