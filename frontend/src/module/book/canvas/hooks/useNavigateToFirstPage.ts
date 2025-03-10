import * as fabric from 'fabric';
import { Page } from '@/common/types/book';
// import { PageService } from '@/services/page.service';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageService } from '@/services/PageService';
import { BookPageParams } from '@/common/interfaces';

const useNavigateToFirstPage = (
  canvas: fabric.Canvas | null,
//   page: Page | undefined,
//   bookId: number,
//   pageId: number,
  pages: Page[]
) => {
  //   console.log('#f2 useNavigateToFirstPage');
  const navigate = useNavigate();
  const pageParams = useParams<BookPageParams>();
  const bookId = Number(pageParams.bookId);
  let pageId = pageParams.pageId ? Number(pageParams.pageId) : 0;

  const page = PageService.getPageById(pages, pageId);
  
  if (pageId === 0) {
    pageId = pages[0].pageId;
  }

  useEffect(() => {
    if (canvas && !page) {
      navigate(`/book/${bookId}/pages/${pageId}`, {
        replace: true, // N'ajoute pas à l'historique du navigateur
      });
    }
  }, [canvas]);
};
export default useNavigateToFirstPage;
