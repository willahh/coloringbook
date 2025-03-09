import BreadCrumb from '@components/BreadCrumb';
import InlineEdit from '@components/InlineEdit';
import { useSelector } from '@/common/store';
import { Book } from '@apptypes/book';
import { selectIsLoading } from '../BookSlice';
import HeaderDesktop from '@/common/components/header/HeaderDesktop';

const BookFooterDesktop: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  const isLoading = useSelector(selectIsLoading);

  return (
    <HeaderDesktop isLoading={isLoading}>
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
    </HeaderDesktop>
  );
};
export default BookFooterDesktop;
