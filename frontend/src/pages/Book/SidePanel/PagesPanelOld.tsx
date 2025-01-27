// import Pages from '@/pages/book/sidePanel/Pages';
import { PanelHeader } from './PanelHeader';
// import { Page } from '@/domain/book';
import { motion } from 'framer-motion'; // Assuming you use framer-motion for animations
import type { Page } from '@/domain/book';
import { useContext } from 'react';
import { BookPageContext } from '@/pages/book/page';
import { Link } from 'react-router-dom';
import { BookService } from '@/services/BookService';

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
      className={``}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: transitionDelay,
        duration: 0.1,
        type: 'tween',
      }}
      // tabIndex={0}
      // onFocus={() => {
      //   console.log('on focus');
      // }}
    >
      <Link
        className={`border-2 border-indigo-500 rounded-sm overflow-hidden shadow-sm shadow-black
        focus:outline-dashed focus:outline-2 focus:-outline-offset-4
      transition-all duration-150 ease-in-out
      ${selected ? 'border-indigo-200' : ''}

      flex flex-col w-14 h-20
      `}
        to={`/book/${bookId}/pages/${pageId}`}
      >
        <div className="flex flex-1 bg-white"></div>
        <div
          className={`bg-indigo-500 text-xs p-0.5 text-right
        ${selected ? 'bg-indigo-200 text-black' : ''}`}
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
  const {
    pageParams: { pageId, bookId },
  } = useContext(BookPageContext);
  const selectedPageId = pageId ? Number(pageId) : -1;
  const useSpread = true;
  let spreads: Page[][] = [];

  if (useSpread) {
    spreads = BookService.transformPagesToSpread(pages);
  } else {
    spreads = [pages];
  }

  const renderSpreads = () => {
    return spreads.map((spread, index) => (
      <>
        <div key={`spread-${index}`} className="flex justify-center mb-4">
          {spread.map((page) => (
            <PageComponent
              key={page.pageId}
              bookId={Number(bookId)}
              page={page}
              selected={page.pageId === selectedPageId}
            />
          ))}
          {index === 1 ? <div className="w-14 h-20 "></div> : null}
        </div>
      </>
    ));
  };

  return <div className={`flex flex-col ${className}`}>{renderSpreads()}</div>;
};

export default Pages;













export const PagesPanel: React.FC<{ className?: string; pages: Page[] }> = ({
  className, pages
}) => {
  return (
    <div className={`${className}`}>
      <PanelHeader>[icon] PagesPanel</PanelHeader>
      <Pages pages={pages} />
    </div>
  );
};
