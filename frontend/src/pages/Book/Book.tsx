import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layout';
import Pages from '@/components/pages/Pages';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import PointerIcon from '@assets/icons/icon_pointer.svg?react';
import RectangleIcon from '@assets/icons/icon_rectangle.svg?react';
import CircleIcon from '@assets/icons/icon_circle.svg?react';
import TriangleIcon from '@assets/icons/icon_triangle.svg?react';
import TextIcon from '@assets/icons/icon_text.svg?react';

const ToolbarButton: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <button
      type="button"
      className="rounded-lg w-12 h-12 p-1 flex items-center justify-center transition-all
  text-white group border border-transparent
  hover:bg-primary-900  hover:border-primary-500
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      {children}
    </button>
  );
};
const Toolsbar: React.FC = () => {
  return (
    <div className="w-20 flex flex-col items-center pt-4 gap-4 border-l border-r border-primary-800">
      <ToolbarButton>
        <PointerIcon
          aria-hidden="true"
          className="size-6 fill-primary-200 group-hover:fill-white group-focus:fill-white"
          style={{
            position: 'relative',
            left: '2px',
          }}
        />
      </ToolbarButton>
      <ToolbarButton>
        <RectangleIcon
          aria-hidden="true"
          className="size-6 stroke-primary-200 group-hover:stroke-white group-focus:stroke-white"
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton>
        <CircleIcon
          aria-hidden="true"
          className="size-6 stroke-primary-200 group-hover:stroke-white group-focus:stroke-white"
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton>
        <TriangleIcon
          aria-hidden="true"
          className="size-6 stroke-primary-200 group-hover:stroke-white group-focus:stroke-white"
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton>
        <TextIcon
          aria-hidden="true"
          className="size-6 stroke-primary-200 group-hover:stroke-white group-focus:stroke-white"
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
    </div>
  );
};

const PagesPanel: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${className}`}>
      <Pages />
    </div>
  );
};

const TemplatePanel: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${className}  p-2 text-xs`}>
      <div>TemplatePanel</div>
      <div>Dessin 1</div>
      <div>Dessin 2</div>
      <div>Dessin 3</div>
      <div>Uploader une image</div>
    </div>
  );
};

const MainSpread: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      data-name="MainSpread"
      className={`${className || ''}  border-4 border-primary-500 flex`}
    >
      {children}
    </div>
  );
};
const MainPage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      data-name="MainPage"
      className={`${className || ''} bg-white border border-primary-500
      snap-center`}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '210 / 297',
      }}
    >
      MainPage
    </div>
  );
};

const MainPanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return <main className={`${className || ''}`}>{children}</main>;
};

const Range: React.FC = () => {
  return (
    // <div className="price-range p-4">
    <input
      className="w-full accent-indigo-600"
      type="range"
      name=""
      value="300"
      min="0"
      max="1000"
      onInput={() => {
        // (e.currentTarget.previousElementSibling as HTMLElement)!.innerText =
        //   e.currentTarget.value;
      }}
    />
    // </div>
  );
};

const PageToolbar: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return <main className={`${className || ''} "w-full`}>{children}</main>;
};

const ColorPanel: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div>
      <div
        className={`${
          className || ''
        } p-2 text-xs bg-primary-950 font-medium text-primary-500 select-none`}
      >
        Couleurs
      </div>
      <div className="grid grid-cols-4 gap-4 p-4 text-xs">
        <div className="w-12 h-7 bg-red-500 rounded-md border-2 border-primary-700"></div>
        <div className="w-12 h-7 bg-yellow-500 rounded-md border-2 border-primary-700"></div>
        <div className="w-12 h-7 bg-blue-500 rounded-md border-2 border-primary-700"></div>
        <div className="w-12 h-7 bg-green-500 rounded-md border-2 border-primary-700"></div>
        <div className="w-12 h-7 bg-orange-500 rounded-md border-2 border-primary-700"></div>
      </div>
    </div>
  );
};

const SidePanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return <aside className={`${className || ''}`}>{children}</aside>;
};
const VerticalSeparator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`${
        className || ' flex items-center justify-center cursor-grabbing'
      } bg-primary-950 border-t border-b border-t-primary-800 border-b-primary-800 h-3`}
    >
      <EllipsisHorizontalIcon className="w-4 h-4 text-primary-400" />
    </div>
  );
};

const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout className={`w-full flex`} showHeader={true}>
      <SidePanel className="flex flex-row bg-primary-900 w-72">
        <div className="flex-1 border-r border-primary-950">
          <PagesPanel className="h-96" />
          <VerticalSeparator />
          <TemplatePanel className="" />
          <VerticalSeparator />
          <ColorPanel className="" />
        </div>
        <Toolsbar />
      </SidePanel>

      <MainPanel className="flex flex-1 bg-slate-900 flex-col">
        <div
          data-name="spread-container"
          className={`flex-1 flex justify-center items-center p-10
            snap-x overflow-x-auto`}
        >
          <MainSpread className="h-full ">
            <MainPage />
            <MainPage />
          </MainSpread>
        </div>
        <PageToolbar className="">
          <div
            className="bg-white rounded-lg p-4 shadow-lg"
            style={{ maxWidth: '300px' }}
          >
            <Range />
          </div>
        </PageToolbar>
      </MainPanel>
    </Layout>
  );
};

export default BookPage;
