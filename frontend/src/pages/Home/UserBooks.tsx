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
  minItems,
  itemClassName,
  books,
  loading,
  highlightBookId,
}) => {
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
                highlightBookId={highlightBookId}
                book={books[index]}
              />
            ) : (
              // No book
              <UserBookItem
                index={index}
                highlightBookId={highlightBookId}
                book={{
                  coverImage: `${getPublicURI()}/book_covers/${++index}.jpg`,
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
