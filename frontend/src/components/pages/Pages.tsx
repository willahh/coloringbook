import { motion } from 'framer-motion'; // Assuming you use framer-motion for animations
import type { Page } from '@/domain/book';
import { useContext } from 'react';
import { CanvasContext } from '@/pages/book/page';
import { Link } from 'react-router-dom';

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
  const transitionDelay = pageNumber / 10;

  return (
    <Link to={`/book/${bookId}/pages/${pageId}`}>
      <motion.div
        className={`flex flex-col w-14 h-20 
      border-2 border-indigo-500 rounded-sm overflow-hidden shadow-md shadow-black
      focus:outline-dashed focus:outline-2 focus:-outline-offset-4
      transition duration-150 ease-in-out
      ${selected ? 'border-indigo-200' : ''}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: transitionDelay,
          duration: 1,
          type: 'tween',
        }}
        tabIndex={0}
        onFocus={() => {
          console.log('on focus');
        }}
      >
        <div className="flex flex-1 bg-white"></div>
        <div
          className={`bg-indigo-500 text-xs p-0.5 text-right
        ${selected ? 'bg-indigo-200 text-black' : ''}`}
        >
          {pageNumber}
        </div>
      </motion.div>
    </Link>
  );
};

interface PagesProps {
  className?: string;
  pages: Page[];
}

const Pages: React.FC<PagesProps> = ({ className, pages }) => {
  const {
    pageParams: { pageId, bookId },
  } = useContext(CanvasContext);
  const selectedPageId = pageId ? Number(pageId) : -1;
  const iBookId = bookId ? Number(bookId) : -1;

  const renderPages = () => {
    const renderedPages = [];

    // First page always alone on its row
    renderedPages.push(
      <div key="page-first" className="flex justify-center mb-4">
        <div className="w-14 h-20"></div>
        <PageComponent
          bookId={iBookId}
          page={pages[0]}
          selected={pages[0].pageId === selectedPageId}
        />
      </div>
    );

    // Middle pages in pairs
    for (let i = 1; i < pages.length - 1; i++) {
      renderedPages.push(
        <>
          <div key={`page-${i}`} className="flex justify-center mb-4">
            <PageComponent
              bookId={iBookId}
              page={pages[i]}
              selected={pages[i].pageId === selectedPageId}
            />
            {i + 1 < pages.length && (
              <PageComponent
                bookId={iBookId}
                page={pages[i + 1]}
                selected={pages[i + 1].pageId === selectedPageId}
              />
            )}
          </div>
        </>
      );
    }

    // Last page always alone on its row
    renderedPages.push(
      <div key="page-last" className="flex justify-center mb-4">
        <div className="w-14 h-20"></div>
        <PageComponent
          bookId={iBookId}
          page={pages[pages.length - 1]}
          selected={pages[pages.length - 1].pageId === selectedPageId}
        />
      </div>
    );

    return renderedPages;
  };

  return (
    <div>
      <motion.div
        // className={`flex flex-col ${className}`}
        className={`  ${className}`}
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {renderPages()}
      </motion.div>
    </div>
  );
};

export default Pages;
