import React, { useState } from 'react';
import Button from '@components/Button';
import { IBook } from '@/domain/book';

const initialBooks: IBook[] = [
  { id: 1, name: 'Livre 1', image: 'placeholder.jpg' },
  { id: 2, name: 'Livre 2', image: 'placeholder.jpg' },
  // Ajoutez d'autres livres ici
];

interface BookItemProps {
  book: IBook;
  handleRename: (id: number, newName: string) => void;
  handleDelete: (id: number) => void;
  handleChangeImage: (id: number, newImage: string) => void;
}
const BookItem: React.FC<BookItemProps> = ({
  book,
  handleRename,
  handleDelete,
  handleChangeImage,
}) => {
  return (
    <div key={book.id} className="book-item relative">
      <img src={book.image} alt={book.name} className="w-full h-auto" />
      <div className="book-info absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
        <input
          type="text"
          value={book.name}
          onChange={(e) => handleRename(book.id, e.target.value)}
          className="bg-transparent border-none text-white w-full"
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
  );
};

const UserBooks: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>(initialBooks);

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
