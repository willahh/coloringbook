import { createAsyncThunk } from '@reduxjs/toolkit';
import { Element } from '@apptypes/book';
import { trackBookEvent } from '@/common/utils/analyticsEvents';
// import canvasService from '@/services/canvas.service';

/**
 * addElementToPage
 */
export const addElementToPage = createAsyncThunk<
  {
    element: Element;
    pageId: number;
  },
  {
    element: Element;
    pageId: number;
  }
>('ELEMENT/ADD_ELEMENT_TO_PAGE', async ({ element, pageId }) => {
  console.log(`#01 ELEMENT/ADD_ELEMENT_TO_PAGE pageId: ${pageId}`);
  const bookId = 0;
  const bookName = '';
  trackBookEvent('BOOK_ELEMENT_ADD_TO_PAGE', { id: bookId, name: bookName });
  return { element: element, pageId: pageId };
});

/**
 * removeElementByPageIdAndElementId
 */
export const removeEementByPageIdAndElementId = createAsyncThunk<
  {
    pageId: number;
    elementId: number;
  },
  {
    pageId: number;
    elementId: number;
  }
>(
  'ELEMENT/REMOVE_ELEMENT_BY_PAGE_ID_AND_ELEMENT_ID',
  async ({ elementId, pageId }) => {
    return { elementId: elementId, pageId: pageId };
  }
);

/**
 * updateElementByElementId
 */
export const updateElementByElementId = createAsyncThunk<
  {
    pageId: number;
    element: Element;
  },
  {
    pageId: number;
    element: Element;
  }
>('ELEMENT/UPDATE_ELEMENT_BY_ELEMENT_ID', async ({ element, pageId }) => {
  return { element: element, pageId: pageId };
});
