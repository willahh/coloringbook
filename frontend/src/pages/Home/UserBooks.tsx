import React, { useState, useEffect } from 'react';
import { IBook } from '@/domain/book';
import { getBooksUrl, getPublicURI } from '@/utils/api';
import { UserBookItem } from './UserBook';

const UserBooks: React.FC<{ itemClassName?: string; minItems: number }> = ({
  itemClassName: itemClassName,
  minItems,
}) => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(getBooksUrl());
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
      {Array.from({
        length: Math.min(20, Math.max(minItems, Math.max(20, books.length))),
      }).map((_, index) => (
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
                  coverImage: `${getPublicURI()}/book_covers/${++index}.jpg`,
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
      ))}
    </>
  );
};

export default UserBooks;
