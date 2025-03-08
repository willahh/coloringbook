import { Bars3Icon } from '@heroicons/react/24/outline';
import { LuUndo, LuRedo } from 'react-icons/lu';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import Header from '@/common/components/header/Header';
import MobileSidebarMenu from '@components/MobileSidebarMenu';
import { footerButtonClasses } from '@/common/utils/buttonStyles';

import { useSelector } from '@/common/store';
import { Book } from '@apptypes/book';
import { selectIsLoading } from '../BookSlice';
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
          autoFocus={true}
          onClick={() => setIsSidebarOpen(true)}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <button
          className={`${footerButtonClasses} `}
          onClick={() => setIsDrawerOpen(true)}
        >
          {isDrawerOpen ? (
            <IoIosArrowDown className="w-6 h-6" />
          ) : (
            <IoIosArrowUp className="w-6 h-6" />
          )}
        </button>
        <button
          className={`${footerButtonClasses}`}
          disabled={true}
          onClick={() => {}}
        >
          <LuUndo className="w-6 h-6" />
        </button>
        <button
          className={`${footerButtonClasses}`}
          disabled={true}
          onClick={() => {}}
        >
          <LuRedo className="w-6 h-6" />
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
