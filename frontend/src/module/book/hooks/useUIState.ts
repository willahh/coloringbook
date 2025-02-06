import { useCallback } from 'react';
import { BookAction } from '../book.reducer.ts_';

export const useUIState = (dispatch: React.Dispatch<BookAction>) => {
  const setModified = useCallback(
    (isModified: boolean) => {
      dispatch({ type: 'SET_MODIFIED', payload: isModified });
    },
    [dispatch]
  );

  const setRefreshGraphics = useCallback(
    (refresh: boolean) => {
      dispatch({ type: 'REFRESH_GRAPHICS', payload: refresh });
    },
    [dispatch]
  );

  return { setModified, setRefreshGraphics };
};
