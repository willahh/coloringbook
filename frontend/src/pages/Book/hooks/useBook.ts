import { useReducer, useEffect, useState } from 'react';
import { BookService } from '@/services/BookService';
import { bookReducer, initialBookState } from '../reducers/bookReducer';

export const useBook = (bookId: string) => {
  const [state, dispatch] = useReducer(bookReducer, initialBookState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const book = await BookService.getBook(bookId);
        const { book: newBook, isModified } = BookService.prepareBookData(book);
        dispatch({ type: 'SET_BOOK', payload: newBook });
        dispatch({ type: 'SET_MODIFIED', payload: isModified });
      } catch (err) {
        setError(`Erreur lors du chargement du livre ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  return { state, dispatch, isLoading, error };
};
