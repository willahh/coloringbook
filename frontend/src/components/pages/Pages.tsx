import { motion } from 'framer-motion'; // Assuming you use framer-motion for animations
import type { Page } from '@/domain/book';

interface PageComponentProps {
  page: Page;
}

const PageComponent: React.FC<PageComponentProps> = ({
  page: { pageNumber },
}) => {
  const transitionDelay = pageNumber / 10;

  return (
    <motion.div
      className="flex flex-col 
      w-14 h-20
      focus:outline-dashed focus:outline-2 focus:-outline-offset-4
      border-2 border-indigo-500 rounded-md overflow-hidden shadow-md shadow-black
      transition duration-150 ease-in-out
      "
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
      <div className="bg-indigo-500 text-xs p-0.5 text-right">{pageNumber}</div>
    </motion.div>
  );
};

interface PagesProps {
  className?: string;
  pages: Page[];
}

const Pages: React.FC<PagesProps> = ({ className, pages }) => {
  const renderPages = () => {
    const renderedPages = [];

    // First page always alone on its row
    renderedPages.push(
      <div key="first" className="flex justify-center mb-4">
        <div className="w-14 h-20"></div>
        <PageComponent page={pages[0]} />
      </div>
    );

    // Middle pages in pairs
    for (let i = 1; i < pages.length - 1; i++) {
      renderedPages.push(
        <>
          <div key={i} className="flex justify-center mb-4">
            <PageComponent page={pages[i]} />
            {i + 1 < pages.length && <PageComponent page={pages[i + 1]} />}
          </div>
        </>
      );
    }

    // Last page always alone on its row
    renderedPages.push(
      <div key="last" className="flex justify-center mb-4">
        <div className="w-14 h-20"></div>
        <PageComponent page={pages[pages.length - 1]} />
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
