import { motion } from 'motion/react';
interface PageProps {
  pageNumber: number;
}

const Page: React.FC<PageProps> = ({ pageNumber }) => {
  const transitionDelay = pageNumber / 10;
  
  return (
    <motion.div
      className="flex flex-col 
      w-14 h-20
      focus:outline-dashed focus:outline-2 focus:-outline-offset-4
      border-2 border-indigo-500  rounded-md overflow-hidden shadow-md shadow-black
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
}
const Pages: React.FC<PagesProps> = ({ className }) => {
  return (
    <div>
      <motion.div
        className={`grid grid-cols-2 gap-4 p-4 ${className}`}
        // initial={{ y: -200, opacity: 0 }}
        // animate={{ y: 0, opacity: 100}}
        // transition={{delay: 3}}
      >
        <Page pageNumber={1} />
        <Page pageNumber={2} />
        <Page pageNumber={3} />
        <Page pageNumber={4} />
        <Page pageNumber={5} />
        <Page pageNumber={6} />
      </motion.div>
    </div>
  );
};

export default Pages;
