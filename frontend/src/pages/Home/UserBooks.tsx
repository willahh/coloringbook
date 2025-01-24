import React from 'react';
import { IBook } from '@/domain/book';
import { UserBookItem } from './UserBook';
import { BookFormat } from '@/domain/book.enum';

interface UserBooksProps {
  minItems: number;
  itemClassName: string;
  books: IBook[];
  loading?: boolean;
  highlightBookId: number;
}

const UserBooks: React.FC<UserBooksProps> = ({
  itemClassName,
  books,
  loading,
  highlightBookId,
}) => {
  return (
    <>
      {Array.from({
        length: 20,
      }).map((_, index) => (
        <div key={index} className={itemClassName}>
          {!loading &&
            (books[index] ? (
              // Book
              <UserBookItem
                index={index}
                highlightBookId={highlightBookId}
                book={books[index]}
              />
            ) : (
              // No book
              <UserBookItem
                index={index}
                highlightBookId={highlightBookId}
                book={{
                  coverImage: '',
                  id: -1,
                  format: BookFormat.CARRE,
                  name: 'Aucun livre',
                  pageCount: 1,
                  pages: [],
                }}
              />
            ))}
        </div>
      ))}
    </>
  );
};

export default UserBooks;
