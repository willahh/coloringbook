import { Bars3Icon } from '@heroicons/react/24/outline';
import { LuUndo, LuRedo } from 'react-icons/lu';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import MobileSidebarMenu from '@components/MobileSidebarMenu';
import { footerButtonClasses } from '@/common/utils/buttonStyles';
import { useSelector } from '@/common/store';
import { Book } from '@apptypes/book';
import { selectIsLoading } from '../BookSlice';
import { useState } from 'react';
import FooterMobile from '@/common/components/footer/FooterMobile';

const BookFooterMobile: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book }) => {
  const isLoading = useSelector(selectIsLoading);
  const [isTabsPanelOpen, setIsTabsPanelOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <FooterMobile isLoading={isLoading}>
      <div className="flex gap-4">
        <button
          className={`${footerButtonClasses}`}
          autoFocus={true}
          onClick={() => setIsSidebarOpen(true)}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <button
          className={`${footerButtonClasses}`}
          onClick={() => setIsTabsPanelOpen(!isTabsPanelOpen)}
        >
          {isTabsPanelOpen ? (
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
      {/* {isTabsPanelOpen && (
        <div className="absolute bottom-16 right-4 w-80 h-96 bg-white rounded-lg shadow-lg">
          <FooterTabsPanelMobile />
        </div>
      )} */}
      <MobileSidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </FooterMobile>
  );
};

export default BookFooterMobile;
