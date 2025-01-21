import { IBook } from '@/domain/book';
import { getMediaUrl } from '@/utils/api';
import { motion } from 'motion/react';

interface BookItemProps {
  index: number;
  book: IBook;
  highlightBookId: number;
}

export const UserBookItem: React.FC<BookItemProps & { className?: string }> = ({
  index,
  book,
  className,
  highlightBookId,
}) => {
  let cls = `${className} relative w-full aspect-[1/1.414] rounded-md overflow-hidden
  `;
  const bookExist = book.id !== -1;
  if (bookExist) {
    cls += ` cursor-pointer transition-all
      focus-visible:outline-2 focus-visible:outline focus-visible:scale-110 
      focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
      
      border-2 border-transparent
      hover:border-white
      `;
  }
  const highlightBook = book.id === highlightBookId;

  if (index === 7) {
    // Layout specificity
    cls += ' xl:hidden';
  }

  if (index === 6 || index === 18 || index === 19) {
    cls += ' md:hidden xl:block';
  }

  let imageUrl = '';
  imageUrl += '';
  if (book.coverImage === '' || book.coverImage == null) {
    imageUrl = `public/book_covers/${++index}.jpg`;
  } else {
    imageUrl = `${getMediaUrl()}/${book.coverImage}`;
  }

  return (
    <motion.div
      className={cls}
      style={{
        background: `linear-gradient(to right, rgb(60, 13, 20) 3px, rgba(255, 255, 255, 0.5) 5px, rgba(255, 255, 255, 0.25) 7px, rgba(255, 255, 255, 0.25) 10px, transparent 12px, transparent 16px, rgba(255, 255, 255, 0.25) 17px, transparent 22px), center center / cover url(${imageUrl})`,
        boxShadow:
          '0 0 5px -1px black, inset -1px 1px 2px rgba(255, 255, 255, 0.5)',
        margin: 'auto',
        borderRadius: '5px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: bookExist ? `sepia(20%)` : `sepia(50%) blur(2px)`,
      }}
      tabIndex={bookExist ? 1 : 0}
      onFocus={bookExist ? () => console.log('focus') : undefined}
      initial={{
        opacity: 0,
        ...(highlightBook ? { transform: 'scale(2)' } : {}),
      }}
      
      animate={{
        opacity: 1,
        ...(highlightBook ? { transform: 'scale(1)' } : {}),
      }}
      transition={{
        delay: index / 10,
        duration: 1,
        type: 'tween',
      }}
    >
      <div className="book-info absolute w-full bottom-0 left-0 text-white p-2 pointer-events-none">
        <div
          className={`bg-transparent border-none text-white w-full cursor-default select-none
          font-serif font-semibold leading-1 lg:leading-4 md:text-xs lg:text-lg `}
          style={{ textShadow: '1px 1px 2px #000', padding: '1px 1px 1px 0' }}
        >
          {book.name}
        </div>

        {/* <input
            type="text"
            value={book.name}
            // onChange={(e) => handleRename(book.id, e.target.value)}
            className="bg-transparent border-none text-primary-900 w-full font-serif text-sm font-semibold"
          /> */}
        {/* <Button onClick={() => handleDelete(book.id)} className="text-red-500">
          Supprimer
        </Button>
        <Button
          onClick={() => handleChangeImage(book.id, 'new-placeholder.jpg')}
          className="text-blue-500"
        >
          Changer Image
        </Button> */}
      </div>
    </motion.div>
  );
};
