import { Bars3Icon } from '@heroicons/react/24/outline';
import { GrUndo, GrRedo } from "react-icons/gr";
import Header from '@/common/components/header/Header';
import MobileSidebarMenu from '@components/MobileSidebarMenu';
import { footerButtonClasses } from '@/common/utils/buttonStyles';

import { useSelector } from '@/common/store';
import { Book } from '@apptypes/book';
import { selectIsLoading } from '../Book.slice';
import MobileDrawer from './MobileDrawer'; // Importe le nouveau composant

import { useState } from 'react';


const BookFooterMobile: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book }) => {
  const isLoading = useSelector(selectIsLoading);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <Header isLoading={isLoading}>
      <div className="flex gap-4">
        <button
          className={`${footerButtonClasses}`}
          onClick={() => setIsSidebarOpen(true)}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <button
          className={`${footerButtonClasses}`}
          onClick={() => {}}
        >
          <GrUndo className="w-6 h-6" />
        </button>
        <button
          className={`${footerButtonClasses}`}
          onClick={() => {}}
        >
          <GrRedo className="w-6 h-6" />
        </button>

        <button
          className={`${footerButtonClasses} `}
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
      </div>
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        book={book}
      />

      <MobileSidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </Header>
  );
};
export default BookFooterMobile;
