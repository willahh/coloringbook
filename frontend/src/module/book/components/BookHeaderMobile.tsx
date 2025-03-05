import BreadCrumb from '@components/BreadCrumb';
import Header from '@/common/components/header/Header';
import InlineEdit from '@components/InlineEdit';
import { useSelector } from '@/common/store';
import { Book } from '@apptypes/book';
import { selectIsLoading } from '../Book.slice';
import MobileDrawer from './MobileDrawer'; // Importe le nouveau composant
import { useState } from 'react';

const BookHeaderMobile: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  const isLoading = useSelector(selectIsLoading);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <Header isLoading={isLoading}>
      {/* Drawer trigger */}
      <button
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md z-50"
        onClick={() => setIsDrawerOpen(true)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        book={book}
      />
      <BreadCrumb
        pages={[
          {
            current: false,
            href: '/library',
            content: 'Bibliothèque',
            description: 'Accéder à ma bibliothèque de livres',
          },
          ...(book
            ? [
                {
                  current: true,
                  href: '/books/' + book.id,
                  content: (
                    <InlineEdit value={book.name} onEdit={onBookNameEdit} />
                  ),
                },
              ]
            : []),
        ]}
      />
    </Header>
  );
};
export default BookHeaderMobile;
