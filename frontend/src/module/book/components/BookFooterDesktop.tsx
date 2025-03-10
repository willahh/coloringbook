import { LuUndo, LuRedo } from 'react-icons/lu';

import BreadCrumb from '@components/BreadCrumb';
import InlineEdit from '@components/InlineEdit';
import { useSelector } from '@/common/store';
import { Book } from '@apptypes/book';
import { selectBook, selectIsLoading } from '../BookSlice';
import HeaderDesktop from '@/common/components/header/HeaderDesktop';
import { footerButtonClasses } from '@/common/utils/buttonStyles';
import SavePopOver from '@/common/components/header/SavePopOver';

const BookFooterDesktop: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  const isLoading = useSelector(selectIsLoading);
  const { areLocalUpdatesSaved } = useSelector(selectBook);

  return (
    <HeaderDesktop isLoading={isLoading}>
      <BreadCrumb className='mr-6'
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
    </HeaderDesktop>
  );
};
export default BookFooterDesktop;
