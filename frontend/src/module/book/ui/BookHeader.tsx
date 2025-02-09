import BreadCrumb from '@/components/BreadCrumb';
import Header from '@/components/Header';
import InlineEdit from '@/components/InlineEdit';
import { useAppSelector } from '@/hooks/useRedux';
import { Book } from '@/types/book';
import { selectIsLoading } from '../book.state';

const BookHeader: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  const isLoading = useAppSelector(selectIsLoading);

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
export default BookHeader;
