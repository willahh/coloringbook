import React from 'react';
// import { useParams } from 'react-router-dom';
import Layout from '../layout';
import Pages from '@/components/pages/Pages';
import {
  EllipsisHorizontalIcon,
  ArrowDownOnSquareStackIcon,
} from '@heroicons/react/20/solid';
import PointerIcon from '@assets/icons/icon_pointer.svg?react';
import RectangleIcon from '@assets/icons/icon_rectangle.svg?react';
import CircleIcon from '@assets/icons/icon_circle.svg?react';
import TriangleIcon from '@assets/icons/icon_triangle.svg?react';
import TextIcon from '@assets/icons/icon_text.svg?react';

// import { Flex, Text, Button } from '@radix-ui/themes';
import * as Slider from '@radix-ui/react-slider';
import * as HoverCard from '@radix-ui/react-hover-card';

import { PageToolbar } from './PageToolbar';
import { ToolbarButton } from './ToolbarButton';

const HoverCardDemo = () => (
  <HoverCard.Root>
    <HoverCard.Trigger asChild>
      <a
        className="inline-block cursor-pointer rounded-full shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] outline-none focus:shadow-[0_0_0_2px_white]"
        href="https://twitter.com/radix_ui"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          className="block size-[45px] rounded-full"
          src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
          alt="Radix UI"
        />
      </a>
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        className="w-[300px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
        sideOffset={5}
      >
        <div className="flex flex-col gap-[7px]">
          <img
            className="block size-[60px] rounded-full"
            src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
            alt="Radix UI"
          />
          <div className="flex flex-col gap-[15px]">
            <div>
              <div className="m-0 text-[15px] font-medium text-mauve12">
                Radix
              </div>
              <div className="m-0 text-[15px] text-mauve10">@radix_ui</div>
            </div>
          </div>
        </div>

        <HoverCard.Arrow className="fill-white" />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

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
      <PanelHeader>[icon] PagesPanel</PanelHeader>
      <Pages />
    </div>
  );
};

const TemplatePanel: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${className}`}>
      <PanelHeader>[icon] TemplatePanel</PanelHeader>
      <div className="p-2 text-xs">
        <div>Dessin 1</div>
        <div>Dessin 2</div>
        <HoverCardDemo />
        <div>Dessin 3</div>
        <div>Uploader une image</div>
      </div>
    </div>
  );
};

const GraphicsPanel: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${className}`}>
      <PanelHeader>GraphicsPanel</PanelHeader>
      <div className="p-2 text-xs"></div>
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
      className={`${className || ''}  flex
      
      
      `}
    >
      {children}
    </div>
  );
};
const MainPage: React.FC<{ className?: string; idx: number }> = ({
  className,
  idx,
}) => {
  return (
    <div
      data-name="MainPage"
      className={`${className || ''} flex flex-col`}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '210 / 297',
      }}
    >
      <div
        data-name="bg"
        className={`flex-1 bg-white border border-primary-500

          rounded-lg overflow-hidden
          ring-2 ring-inset ring-gray-300 
          

      snap-center`}
      ></div>
      <div data-name="pageCount" className="text-white text-sm select-none">
        Page {idx} / 12
      </div>
    </div>
  );
};

const MainPanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return <main className={`${className || ''}`}>{children}</main>;
};

// const Range: React.FC = () => {
//   return (
//     // <div className="price-range p-4">
//     <input
//       className="w-full accent-indigo-600"
//       type="range"
//       name=""
//       value="300"
//       min="0"
//       max="1000"
//       onInput={() => {
//         // (e.currentTarget.previousElementSibling as HTMLElement)!.innerText =
//         //   e.currentTarget.value;
//       }}
//     />
//     // </div>
//   );
// };

// const PageToolbar: React.FC<{
//   className?: string;
//   children?: React.ReactNode;
// }> = ({ className, children }) => {
//   return <main className={`${className || ''} "w-full`}>{children}</main>;
// };

const PanelHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={`${
        className || ''
      } p-2 text-xs bg-primary-950 font-medium text-primary-500 select-none
      
      
      `}
    >
      {children}
    </div>
  );
};

const ColorPanel: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div>
      <PanelHeader>Couleurs</PanelHeader>
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
  // const { id } = useParams<{ id: string }>();

  return (
    <Layout className={`w-full flex`} showHeader={true}>
      <SidePanel className="flex flex-row bg-primary-900 w-72">
        <div className="flex-1 border-r border-primary-950">
          <PagesPanel className="h-96" />
          <VerticalSeparator />
          <TemplatePanel className="" />
          <VerticalSeparator />
          <GraphicsPanel className="" />
          <VerticalSeparator />
          <ColorPanel className="" />
        </div>
        <Toolsbar />
      </SidePanel>

      <MainPanel className="flex flex-1 bg-slate-900 flex-col">
        <div
          data-name="spread-container"
          className={`flex-1 flex justify-center items-center p-10 snap-x overflow-x-auto`}
        >
          <MainSpread className="h-full ">
            <MainPage idx={1} />
            <MainPage idx={2} />
          </MainSpread>
        </div>
        <main className="flex justify-center gap-4 w-full">
          <PageToolbar></PageToolbar>
        </main>
      </MainPanel>
    </Layout>
  );
};

export default BookPage;
