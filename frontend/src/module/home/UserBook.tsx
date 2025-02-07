import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Book } from '@/types/book';
import { getMediaUrl } from '@/utils/api';
import { Tooltip } from '@/components/Tooltip';

interface BookItemProps {
  index: number;
  pageName: 'home' | 'library';
  book: Book;
  highlightBookId: number;
}

export const UserBookItem: React.FC<BookItemProps & { className?: string }> = ({
  index,
  pageName,
  book,
  className,
  highlightBookId,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => setImageLoaded(true);
  const navigate = useNavigate();
  const handleBookClick = () => {
    if (bookExist) {
      navigate(`/book/${book.id}`);
    }
  };

  let cls = `${className} relative w-full aspect-[1/1.414] rounded-md overflow-hidden
  `;
  const bookExist = book.id !== -1;
  if (bookExist) {
    cls += ` cursor-pointer transition-all
      focus-visible:outline-2 focus-visible:outline focus-visible:scale-110 
      focus:border-primary-300 dark:focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
      
      border-2 border-transparent
      hover:border-black dark:hover:border-white `;
  }
  const highlightBook = book.id === highlightBookId;

  if (pageName === 'home') {
    if (index === 7) {
      cls += ' xl:hidden';
    }

    if ([1, 5].includes(index)) {
      cls += ' md:hidden xl:block';
    } else {
      cls += ' md:show';
    }
  }

  let imageUrl = '';
  imageUrl += '';
  if (book.coverImage === '' || book.coverImage == null) {
    imageUrl = `${getMediaUrl()}/uploads/cover/default/${++index}.jpg`;
  } else {
    imageUrl = `${getMediaUrl()}/uploads/${book.coverImage}`;
  }

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = handleImageLoad;
  }, [imageUrl]);

  return (
    imageLoaded && (
      <Tooltip content={book.name}>
        <motion.button
          className={cls}
          style={{
            background: `linear-gradient(to right, rgb(60, 13, 20) 3px, rgba(255, 255, 255, 0.5) 5px, rgba(255, 255, 255, 0.25) 7px, rgba(255, 255, 255, 0.25) 10px, transparent 12px, transparent 16px, rgba(255, 255, 255, 0.25) 17px, transparent 22px), center center / cover url(${imageUrl})`,
            backgroundRepeat: 'no-repeat',
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
          onClick={handleBookClick}
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
          <div className="book-info absolute w-full bottom-0 left-0 dark:text-white p-2 pointer-events-none">
            <div
              className={`bg-transparent border-none dark:text-white w-full cursor-default select-none
            font-serif font-semibold leading-1 lg:leading-4 md:text-xs lg:text-lg `}
              style={{ padding: '1px 1px 1px 0' }}
            >
              {book.name}
            </div>
          </div>
        </motion.button>
      </Tooltip>
    )
  );
};
