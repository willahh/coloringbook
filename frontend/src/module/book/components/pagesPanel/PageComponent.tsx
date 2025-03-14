import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Assuming you use framer-motion for animations
import { TrashIcon } from '@heroicons/react/24/outline';

import type { Page } from '@apptypes/book';
import { Tooltip } from '@components/Tooltip';
import useDeletePage from './useDeletePage';

interface PageComponentProps {
  bookId: number;
  page: Page;
  selected: boolean;
  onDeleteButtonClick?: (pageId: number) => void;
}

const PageComponent: React.FC<PageComponentProps> = ({
  bookId,
  page: { pageNumber, pageId, thumbImageData, aspectRatio },
  selected,
}) => {
  const deletePageFn = useDeletePage(bookId);

  return (
    <motion.div
      data-id={`sp-page-${pageId}`}
      key={`pageCmp-${pageId}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        type: 'tween',
      }}
    >
      <Link
        className={`flex flex-col w-full rounded-sm group overflow-hidden
          border-2 border-primary-200 dark:border-primary-800 
          hover:border-secondary-500
          active:ring-2 active:-ring-offset-4 ring-secondary-500
          transition-all duration-150 ease-in-out
        
        ${
          selected
            ? ' border-2 border-secondary-200 dark:border-secondary-500 '
            : ''
        }
        
        `}
        to={`/book/${bookId}/pages/${pageId}`}
      >
        <div
          data-id="page-bg"
          className={`flex flex-1  bg-primary-100 dark:bg-primary-900 hover:bg-primary-100  dark:hover:bg-primary-300
              ${selected ? ' bg-secondary-100 dark:bg-primary-300 ' : ''}`}
          style={{
            aspectRatio: `${aspectRatio.width}/${aspectRatio.height}`,
            backgroundImage: `url(${thumbImageData})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        ></div>
        <div
          data-id="page-option"
          className={`flex justify-end items-center gap-2 
              transition-all duration-200
             bg-primary-200 dark:bg-primary-800 text-xs p-0.5 text-right
          ${
            selected
              ? 'bg-secondary-300 dark:bg-secondary-500 text-secondary-800 dark:text-secondary-300 font-extrabold'
              : ''
          }`}
        >
          <div
            className={`opacity-0 group-hover:opacity-100 group-focus:opacity-100 ${
              selected && 'opacity-100'
            }`}
          >
            <Tooltip content={'Supprimer la page'}>
              <button
                className={`p-xs rounded-sm transition-all cursor-pointer
                 ${
                   selected
                     ? 'group-active:opacity-100 hover:bg-secondary-400 focus:bg-secondary-400'
                     : ''
                 }`}
                onClick={() => {
                  deletePageFn(pageId);
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
          <div className="select-none">{pageNumber}</div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PageComponent;
