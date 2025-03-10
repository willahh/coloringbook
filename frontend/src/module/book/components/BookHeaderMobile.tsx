import { LuUndo, LuRedo } from 'react-icons/lu';
import { BsThreeDots } from "react-icons/bs";


import { footerButtonClasses } from '@/common/utils/buttonStyles';
import { useSelector } from '@/common/store';
import { Book } from '@apptypes/book';
import { selectBook, selectIsLoading } from '../BookSlice';

import HeaderMobile from '@/common/components/header/HeaderMobile';
import SavePopOver from '@/common/components/header/SavePopOver';

const BookHeaderMobile: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = () => {
  const isLoading = useSelector(selectIsLoading);
  const { areLocalUpdatesSaved } = useSelector(selectBook);

  return (
    <HeaderMobile isLoading={isLoading}>
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
      <SavePopOver areLocalUpdatesSaved={areLocalUpdatesSaved} />

      <button
        className={`${footerButtonClasses}`}
        onClick={() => {}}
      >
        <BsThreeDots className="w-6 h-6" />
      </button>
    </HeaderMobile>
  );
};

export default BookHeaderMobile;
