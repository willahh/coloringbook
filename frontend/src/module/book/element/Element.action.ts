import { createAsyncThunk } from '@reduxjs/toolkit';
import { Element } from '@apptypes/book';
import canvasService from '@/services/canvas.service';

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

  canvasService.addElementToCanvas(element);

  return { element: element, pageId: pageId };
});

/**
 * removeElementByPageIdAndElementId
 */
export const removeElementByPageIdAndElementId = createAsyncThunk<
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
