import BreadCrumb from '@/components/BreadCrumb';
import Header from '@/components/Header';
import InlineEdit from '@/components/InlineEdit';
import { IBook } from '@/domain/book';

const BookHeader: React.FC<{
  book: IBook | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  return (
    <Header>
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
