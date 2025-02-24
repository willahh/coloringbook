import { useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@components/Tooltip';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from '@/common/store';
import { selectBook } from '../Book.slice';

export const PagesNavigation: React.FC = () => {
  const { bookId, pageId } = useParams<{ bookId?: string; pageId?: string }>();
  const { book } = useSelector(selectBook);
  const currentPageId = Number(pageId);
  const pageIds = book.pages.map(({ pageId }) => pageId);
  const currentIndex = pageIds.indexOf(currentPageId);
  const nextPageId =
    currentIndex < pageIds.length - 1
      ? pageIds[currentIndex + 1]
      : currentPageId;

  const previousPageId =
    currentIndex > 0 ? pageIds[currentIndex - 1] : currentPageId;
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex === pageIds.length - 1;

  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (!isFirstPage) {
            navigate(`/book/${bookId}/pages/${previousPageId}`);
          }
          break;
        case 'ArrowRight':
          if (!isLastPage) {
            navigate(`/book/${bookId}/pages/${nextPageId}`);
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [bookId, isFirstPage, isLastPage, previousPageId]);

  return (
    <div
      data-id="pages-navigation"
      className="flex flex-col items-center justify-center absolute right-8 gap-4 h-full z-10 pointer-events-none"
    >
      <Tooltip content="Page précédente">
        <Link
          to={`/book/${bookId}/pages/${previousPageId}`}
          className={`w-12 h-12 rounded-full z-10 p-2 pointer-events-auto
              ${isFirstPage ? ' opacity-0' : ''}
          text-primary-800 dark:text-primary-200
           transition-all duration-400
         hover:ring-1 
         hover:bg-primary-50  hover:ring-primary-200
         dark:hover:bg-primary-950  dark:hover:ring-primary-800 
         active:ring-primary-950 dark:active:ring-primary-50
          `}
        >
          <ArrowUpIcon />
        </Link>
      </Tooltip>

      <Tooltip content="Page suivante">
        <Link
          to={`/book/${bookId}/pages/${nextPageId}`}
          className={`w-12 h-12 rounded-full z-10 p-2 pointer-events-auto
              ${isLastPage ? ' opacity-0' : ''}
              text-primary-800 dark:text-primary-200
               transition-all duration-400
             hover:ring-1 
             hover:bg-primary-50  hover:ring-primary-200
             dark:hover:bg-primary-950  dark:hover:ring-primary-800 
             active:ring-primary-950 dark:active:ring-primary-50
              `}
        >
          <ArrowDownIcon />
        </Link>
      </Tooltip>
    </div>
  );
};
