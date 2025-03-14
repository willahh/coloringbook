import { useServices } from '@/common/contexts/ServiceContext';
import { trackBookEvent } from '@/common/utils/analyticsEvents';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import * as BookActions from '../../BookActions';
import { selectBookPages } from '../../BookSlice';

const useDeletePage = (bookId: number) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pages = useSelector(selectBookPages);
  const { bookDataService } = useServices();

  const useDeletePage = (pageIdToDelete: number) => {
    if (confirm('Confirmer la suppression de la page ?')) {
      trackBookEvent('BOOK_PAGE_DELETE', { id: bookId, name: '' });
      dispatch(BookActions.deletePageAction({ pageId: pageIdToDelete }));
      requestAnimationFrame(() => {
        const nextPageId = bookDataService.getNextPageId(pageIdToDelete, pages);
        if (nextPageId !== undefined && bookId) {
          navigate(`/book/${bookId}/pages/${nextPageId}`);
        }
      });
    }
  };

  return useDeletePage;
};

export default useDeletePage;
