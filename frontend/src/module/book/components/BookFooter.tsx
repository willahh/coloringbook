import { Book } from '@apptypes/book';
import useIsMobile from '@/common/hooks/useIsMobile';

import BookFooterMobile from './BookFooterMobile';
import BookFooterDesktop from './BookFooterDesktop';

const BookFooter: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <BookFooterMobile book={book} onBookNameEdit={onBookNameEdit} />;
  } else {
    return <BookFooterDesktop book={book} onBookNameEdit={onBookNameEdit} />;
  }
};
export default BookFooter;
