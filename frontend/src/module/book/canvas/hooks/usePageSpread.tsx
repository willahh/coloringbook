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
  const pageId =
    Number(pageParams.pageId) || BookService.getFirstPageId(pages);

  const useSpread = false; // Display 2 or more pages per spread

  const spreadPages = React.useMemo(() => {
    if (useSpread) {
      return BookService.getSpreadForPage(pages, pageId);
    } else {
      const page = BookService.getPageFromPageId(pages, pageId);
      if (page) {
        return [page];
      } else {
        return [];
      }
    }
  }, [pages, pageId]);

  return { spreadPages };
};
