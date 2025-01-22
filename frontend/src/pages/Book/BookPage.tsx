import React from 'react';
import Layout from '../layout';

import { SpreadToolbar } from './mainPanel/SpreadToolbar';
import { SideToolbar } from './SidePanel/SideToolbar';
import { ColorPanel } from './SidePanel/ColorPanel';
import { SidePanel } from './SidePanel/SidePanel';
import { GraphicsPanel } from './SidePanel/GraphicsPanel';
import { TemplatePanel } from './SidePanel/TemplatePanel';
import { PagesPanel } from './SidePanel/PagesPanel';
import SpreadCanvas from './mainPanel/MainSpread';
import { VerticalSeparator } from './SidePanel/VerticalSeparator';

const BookPage: React.FC = () => {
  // const { id } = useParams<{ id: string }>();

  return (
    <Layout className={`w-full flex`} showHeader={true}>
      <SidePanel
        className="flex flex-row bg-primary-900 w-72 shadow-black z-10
      shadow-[3px_0_10px_-4px_rgb aa(0,0,0,0.3)]"
      >
        <div
          className={`flex-1 border-r border-primary-950 
          overflow-y-auto overflow-x-hidden overflow-y-auto
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
  );
};

export default BookPage;
