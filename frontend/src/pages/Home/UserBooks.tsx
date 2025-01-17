/**
 * UserBooks
 *
 * [TODO]
 * - [ ] Appliquer un filtre aux images peut être gris ou autre
 * - [ ] Skip  élément 8
 */

import React, { useState, useEffect } from 'react';
import { IBook } from '@/domain/book';
import { Transition } from '@headlessui/react';

interface BookItemProps {
  index?: number;
  book: IBook;
  handleRename: (id: number, newName: string) => void;
  handleDelete: (id: number) => void;
  handleChangeImage: (id: number, newImage: string) => void;
}

const UserBookItem: React.FC<BookItemProps & { className?: string }> = ({
  index,
  book,
  // handleRename,
  // handleDelete,
  // handleChangeImage,
  className,
}) => {
  let cls = `${className} relative w-full aspect-[1/1.414] rounded-md overflow-hidden`;
  const bookExist = book.id === -1;

  if (bookExist) {
    cls += `cursor-pointer transition-all
      focus-visible:outline-2 focus-visible:outline focus-visible:scale-110 
      focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500`;
  }
  if (index === 7) {
    // Layout specificity
    cls += ' hidden';
  }

  if (book.coverImage === '') {
    book.coverImage = `public/book_covers/${index}.jpg`;
  }
  return (
    <Transition
      appear={true}
      show={true}
      enter={`transition-all duration-1000 ease-out`}
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-all duration-1000 ease-in"
      leaveFrom="opacity-100"
    >
      <div
        className={cls}
        style={{
          background: `linear-gradient(to right, rgb(60, 13, 20) 3px, rgba(255, 255, 255, 0.5) 5px, rgba(255, 255, 255, 0.25) 7px, rgba(255, 255, 255, 0.25) 10px, transparent 12px, transparent 16px, rgba(255, 255, 255, 0.25) 17px, transparent 22px), center center / cover url(${book.coverImage})`,
          boxShadow:
            '0 0 5px -1px black, inset -1px 1px 2px rgba(255, 255, 255, 0.5)',
          margin: 'auto',
          borderRadius: '5px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // filter: 'grayscale(100%)',
          // filter: `sepia(10%) saturate(30%)`
          filter: bookExist ? `sepia(50%) blur(2px)` : undefined,
        }}
        tabIndex={bookExist ? 1 : 0}
        onFocus={bookExist ? () => console.log('focus') : undefined}
      >
        <div className="book-info absolute w-full bottom-0 left-0 text-white p-2">
          {/* <input
          type="text"
          value={book.name}
          onChange={(e) => handleRename(book.id, e.target.value)}
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
      </div>
    </Transition>
  );
};

const UserBooks: React.FC<{ itemClassName?: string; minItems: number }> = ({
  itemClassName: itemClassName,
  minItems,
}) => {
  console.log('UserBooks');
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/books?delay=500');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleRename = (id: number, newName: string) => {
    setBooks(
      books.map((book) => (book.id === id ? { ...book, name: newName } : book))
    );
  };

  const handleDelete = (id: number) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const handleChangeImage = (id: number, newImage: string) => {
    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, image: newImage } : book
      )
    );
  };

  return (
    <>
      {Array.from({ length: Math.max(minItems, books.length) }).map(
        (_, index) => (
          <div key={index} className={itemClassName}>
            {!loading &&
              (books[index] ? (
                // Book found
                <UserBookItem
                  index={index}
                  book={books[index]}
                  handleRename={handleRename}
                  handleDelete={handleDelete}
                  handleChangeImage={handleChangeImage}
                />
              ) : (
                // No book
                <UserBookItem
                  index={index}
                  book={{
                    coverImage: `public/book_covers/${index}.jpg`,
                    id: -1,
                    image: '',
                    name: '',
                    pageCount: 1,
                  }}
                  handleRename={handleRename}
                  handleDelete={handleDelete}
                  handleChangeImage={handleChangeImage}
                />
              ))}
          </div>
        )
      )}
    </>
  );
};

export default UserBooks;
