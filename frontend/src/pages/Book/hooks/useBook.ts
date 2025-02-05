import { useContext, useEffect, useState } from 'react';
import { BookService } from '@/services/book.service';
import { BookContext } from './../book.context';
// import { bookReducer, initialBookState } from '../book.reducer';

export const useBook = (bookId: number) => {
  console.log('#4 useBook bookId:', bookId)
  const { state, dispatch } = useContext(BookContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log('#4 useBook useEffect fetchBook:', bookId)
        const book = await BookService.getBook(bookId);
        const { book: newBook, isModified } = BookService.prepareBookData(book);
        console.log('#4 fetchBook')
        console.log('#4 book', book)
        console.log('#4 call dispatch SET_BOOK')
        dispatch({ type: 'SET_BOOK', payload: newBook });
        dispatch({ type: 'SET_MODIFIED', payload: isModified });
      } catch (err) {
        setError(`Erreur lors du chargement du livre ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [dispatch, bookId]);

  return { state: state, dispatch, isLoading, error };
};
