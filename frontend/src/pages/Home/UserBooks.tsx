import React, { useState, useEffect } from 'react';
// import Button from '@components/Button';
import { IBook } from '@/domain/book';

interface BookItemProps {
  book: IBook;
  handleRename: (id: number, newName: string) => void;
  handleDelete: (id: number) => void;
  handleChangeImage: (id: number, newImage: string) => void;
}

const BookItem: React.FC<BookItemProps> = ({
  book,
  handleRename,
  //   handleDelete,
  //   handleChangeImage,
}) => {
  return (
    <div className="book-item relative">
      <div
        className="relative w-32 aspect-[1/1.414] border border-primary-500 
        border-1 bg-cover bg-center bg-no-repeat overflow-auto rounded-md shadow-lg
        hover:border-primary-700 hover:scale-105 transition-transform duration-300
        focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        style={{ backgroundImage: `url(${book.coverImage})` }}
        tabIndex={0}
        onFocus={() => console.log('focus')}
      >
        <div className="book-info absolute w-full bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
          <input
            type="text"
            value={book.name}
            onChange={(e) => handleRename(book.id, e.target.value)}
            className="bg-transparent border-none text-white w-full text-xs font-serif"
          />
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
    </div>
  );
};

const UserBooks: React.FC = () => {
  console.log('UserBooks');
  //   const [books, setBooks] = useState<IBook[]>(initialBooks);
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/books?delay=500');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
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
    <div className="user-books">
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          handleRename={handleRename}
          handleDelete={handleDelete}
          handleChangeImage={handleChangeImage}
        />
      ))}
    </div>
  );
};

export default UserBooks;
