import { motion } from 'framer-motion'; // Assuming you use framer-motion for animations
import type { Page } from '@/domain/book';
import { useContext } from 'react';
import { BookPageContext } from '@/pages/book/page';
import { Link } from 'react-router-dom';
import { BookService } from '@/services/BookService';
import { ToolbarButton } from '../spreadViewerCanvas/ui/ToolbarButton';
import { PlusIcon } from '@heroicons/react/24/outline';

interface PageComponentProps {
  bookId: number;
  page: Page;
  selected: boolean;
}

const PageComponent: React.FC<PageComponentProps> = ({
  bookId,
  page: { pageNumber, pageId },
  selected,
}) => {
  const transitionDelay = pageNumber / 12;

  return (
    <motion.div
      key={`pageCmp-${pageId}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        // delay: transitionDelay,
        duration: 0.1,
        type: 'tween',
      }}
    >
      <Link
        className={`flex flex-col w-14 h-20 rounded-sm 
        border-2 border-indigo-500 roverflow-hidden shadow-sm shadow-black
        focus:outline-dashed focus:outline-2 focus:-outline-offset-4
        transition-all duration-150 ease-in-out
      
      ${selected ? ' border-4 border-primary-200 ' : ''}
      
      `}
        to={`/book/${bookId}/pages/${pageId}`}
      >
        <div className="flex flex-1 bg-white"></div>
        <div
          className={`bg-indigo-500 text-xs p-0.5 text-right
        ${selected ? 'bg-indigo-200 text-primary-800 font-extrabold' : ''}`}
        >
          {pageNumber}
        </div>
      </Link>
    </motion.div>
  );
};

interface PagesProps {
  className?: string;
  pages: Page[];
}

const Pages: React.FC<PagesProps> = ({ className, pages }) => {
  console.log('Pages', pages);
  const {
    pageParams: { pageId, bookId },
  } = useContext(BookPageContext);
  const selectedPageId = pageId ? Number(pageId) : -1;
  const useSpread = false;
  let spreads: Page[][] = [];

  if (useSpread) {
    spreads = BookService.transformPagesToSpread(pages);
  } else {
    spreads = [pages];
  }

  const renderSpreads = () => {
    return spreads.map((spread, index) => (
      <div
        key={`spread-${index}`}
        className={`flex gap-4 ${
          useSpread ? 'flex-row' : 'flex-col'
        } justify-center`}
      >
        {spread.map((page) => (
          <PageComponent
            key={page.pageId} // Ajoutez cette ligne
            bookId={Number(bookId)}
            page={page}
            selected={page.pageId === selectedPageId}
          />
        ))}
        {index === 1 ? <div className="w-14 h-20 "></div> : null}
      </div>
    ));
  };

  return <div className={`flex flex-col ${className || ''} rounded-md 
 overflow-y-scroll scrollbar scrollbar-thumb-primary-700 scrollbar-track-primary-900 overflow-y-scroll scrollbar-track-rounded-full`} style={{
    maxHeight: 'calc(100vh - 10em)' // FIXME: magic number 10em
  }}>{renderSpreads()}</div>;
};

export default Pages;

export const PagesPanel: React.FC<{
  className?: string;
  pages: Page[];
  addPageButtonClick: (event: React.MouseEvent) => void;
}> = ({ className, pages, addPageButtonClick }) => {
  console.log('PagesPanel', pages);
  return (
    <div className={`${className || ''} flex flex-col p-4 pr-0 gap-4 overflow-y-auto`}>
      <Pages pages={pages} />
      <ToolbarButton
        tooltipContent="Ajouter une page"
        onClick={addPageButtonClick}
      >
        <PlusIcon
          className="w-full h-full size-6 fill-primary-200 group-hover:fill-white group-focus:fill-white"
          style={{ strokeWidth: '0.05em' }}
        />
      </ToolbarButton>
    </div>
  );
};
