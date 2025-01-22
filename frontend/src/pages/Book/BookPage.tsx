import React from 'react';
import Layout from '../layout';

import { SpreadToolbar } from './components/mainPanel/SpreadToolbar';
import { SideToolbar } from './components/SidePanel/SideToolbar';
import { ColorPanel } from './components/SidePanel/ColorPanel';
import { SidePanel } from './components/SidePanel/SidePanel';
import { GraphicsPanel } from './components/SidePanel/GraphicsPanel';
import { TemplatePanel } from './components/SidePanel/TemplatePanel';
import { PagesPanel } from './components/SidePanel/PagesPanel';
import { MainPage } from './components/mainPanel/MainPage';
import { MainSpread } from './components/mainPanel/MainSpread';
import { VerticalSeparator } from './components/SidePanel/VerticalSeparator';

const MainPanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return <main className={`${className || ''}`}>{children}</main>;
};

const BookPage: React.FC = () => {
  // const { id } = useParams<{ id: string }>();

  return (
    <Layout className={`w-full flex`} showHeader={true}>
      <SidePanel
        className="flex flex-row bg-primary-900 w-72 shadow-black z-10
      shadow-[3px_0_10px_-4px_rgba(0,0,0,0.3)]"
      >
        <div className="flex-1 border-r border-primary-950">
          <PagesPanel className="h-96" />
          <VerticalSeparator />
          <TemplatePanel className="" />
          <VerticalSeparator />
          <GraphicsPanel className="" />
          <VerticalSeparator />
          <ColorPanel className="" />
        </div>
        <SideToolbar />
      </SidePanel>
      <MainPanel className="flex flex-1 bg-slate-900 flex-col">
        <div
          data-name="spread-container"
          className="flex-1 flex justify-center items-center p-10 snap-x overflow-x-auto"
        >
          <MainSpread className="h-full ">
            <MainPage idx={1} />
            <MainPage idx={2} />
          </MainSpread>
        </div>
        <SpreadToolbar></SpreadToolbar>
      </MainPanel>
    </Layout>
  );
};

export default BookPage;
