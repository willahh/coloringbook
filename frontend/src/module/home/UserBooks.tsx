import React from 'react';
import { Book } from '@apptypes/book';
import { BookFormat } from '@apptypes/book.enum';
import { UserBookItem } from './UserBook';


interface UserBooksProps {
  pageName: 'home' | 'library';
  minItems: number;
  itemClassName: string;
  books: Book[];
  loading?: boolean;
  highlightBookId: number;
}

const UserBooks: React.FC<UserBooksProps> = ({
  pageName,
  itemClassName,
  books,
  loading,
  highlightBookId,
  minItems,
}) => {
  const itemsToShow = Math.max(minItems, books.length);

  return (
    <>
      {Array.from({ length: itemsToShow }).map((_, index) => {
        let cls = '';

        if (pageName === 'home') {
          cls += 'hidden';
          if ([19, 18, 17, 16].includes(index)) {
            cls += ' md:hidden xl:block';
          } else {
            cls += ' md:block';
          }
        }

        return (
          <div key={index} className={`${itemClassName} ${cls}`}>
            {!loading &&
              (books[index] ? (
                // Livre existant
                <UserBookItem
                  index={index}
                  pageName={pageName}
                  highlightBookId={highlightBookId}
                  book={books[index]}
                />
              ) : (
                // Livre par défaut
                <UserBookItem
                  index={index}
                  pageName={pageName}
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
        );
      })}
    </>
  );
};

export default UserBooks;
