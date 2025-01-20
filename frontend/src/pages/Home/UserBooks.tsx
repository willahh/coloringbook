import React from 'react';
import { IBook } from '@/domain/book';
import { getPublicURI } from '@/utils/api';
import { UserBookItem } from './UserBook';

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
              // Book found
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
                  image: '',
                  name: '',
                  pageCount: 1,
                }}
              />
            ))}
        </div>
      ))}
    </>
  );
};

export default UserBooks;
