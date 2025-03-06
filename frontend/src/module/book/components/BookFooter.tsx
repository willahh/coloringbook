import { useMediaQuery } from 'react-responsive';

import { Book } from '@apptypes/book';
import BookFooterMobile from './BookFooterMobile';
import BookFooterDesktop from './BookFooterDesktop';

const BookFooter: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Breakpoint md - 1 (767px)

  if (isMobile) {
    return <BookFooterMobile book={book} onBookNameEdit={onBookNameEdit} />;
  } else {
    return <BookFooterDesktop book={book} onBookNameEdit={onBookNameEdit} />;
  }
};
export default BookFooter;
