import BreadCrumb from '@components/BreadCrumb';
import Header from '@/common/components/header/Header';
import InlineEdit from '@components/InlineEdit';
import { useSelector } from '@/common/store';
import { Book } from '@apptypes/book';
import { selectIsLoading } from '../Book.slice';

const BookFooterDesktop: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  const isLoading = useSelector(selectIsLoading);

  return (
    <Header isLoading={isLoading}>
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
export default BookFooterDesktop;
