import React, { useEffect } from 'react';
import { BookService } from '@/services/book.service';
import { Page } from '@/types/book';

export const usePageSpread = (
  pages: Page[],
  pageParams: {
    bookId?: string;
    pageId?: string;
  }
) => {
  const currentPageId = Number(pageParams.pageId) || 0;
  const pageSpread = React.useMemo(
    () => BookService.getSpreadForPage(pages, currentPageId),
    [pages, currentPageId]
  );

  useEffect(() => {
    if (JSON.stringify(pageSpread) !== JSON.stringify(pages)) {
      // Assuming setPages is available in the context where this hook is used
      // setPages(pages);
    }
  }, [pageSpread, pages]);

  return { pageSpread };
};
