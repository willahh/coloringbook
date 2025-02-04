// hooks/usePageManagement.ts
import { useCallback } from 'react';
import { BookService } from '@/pages/Book/book.service';
import { BookAction } from '../book.reducer';
import { Page } from '@/domain/book';

export const usePageManagement = (
  bookId: string,
  dispatch: React.Dispatch<BookAction>
) => {
  const handleSave = useCallback(
    async (pages: Page[]) => {
      try {
        const data = await BookService.updateBook(bookId, { pages });
        if (!data.error) {
          dispatch({ type: 'SET_MODIFIED', payload: false });
        } else if (data.message) {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error saving book:', error);
      }
    },
    [bookId, dispatch]
  );

  const handleAddPageButtonClick = useCallback(() => {
    const newPage: Page = {
      pageId: 10,
      pageNumber: 10,
      aspectRatio: { width: 1, height: 1 },
      elements: [],
    };
    dispatch({ type: 'ADD_PAGE', payload: newPage });
  }, [dispatch]);

  const handleDeleteButtonClick = useCallback(
    (pageId: number) => {
      if (window.confirm('Confirmer la suppression de la page ?')) {
        dispatch({ type: 'DELETE_PAGE', payload: pageId });
      }
    },
    [dispatch]
  );

  return { handleSave, handleAddPageButtonClick, handleDeleteButtonClick };
};
