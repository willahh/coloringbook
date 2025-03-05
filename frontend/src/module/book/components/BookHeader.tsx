import { useMediaQuery } from 'react-responsive';

import { Book } from '@apptypes/book';
import BookHeaderMobile from './BookHeaderMobile';
import BookHeaderDesktop from './BookHeaderDesktop';

const BookHeader: React.FC<{
  book: Book | null;
  onBookNameEdit: (newName: string) => void;
}> = ({ book, onBookNameEdit }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Breakpoint md - 1 (767px)

  if (isMobile) {
    return <BookHeaderMobile book={book} onBookNameEdit={onBookNameEdit} />;
  } else {
    return <BookHeaderDesktop book={book} onBookNameEdit={onBookNameEdit} />;
  }
};
export default BookHeader;
