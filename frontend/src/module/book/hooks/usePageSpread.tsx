import React from 'react';
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
  let useSpread = false; // Display 2 or more pages per spread

  const spreadPages = React.useMemo(() => {
    if (useSpread) {
      return BookService.getSpreadForPage(pages, currentPageId);
    } else {
      return [BookService.getPageFromPageId(pages, currentPageId)];
    }
  }, [pages, currentPageId]);

  return { spreadPages };
};
