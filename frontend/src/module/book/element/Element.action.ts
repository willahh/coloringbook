import { createAction } from '@reduxjs/toolkit';
import { Element } from '@apptypes/book';

/**
 * addElementToPage
 */
export const addElementToPage = createAction<{
  element: Element;
  pageId: number;
}>('ELEMENT/ADD_ELEMENT_TO_PAGE');

/**
 * removeElementByPageId
 */
export const removeElementByPageId = createAction<{
  element: Element;
  pageId: number;
}>('ELEMENT/ADD_ELEMENT_TO_PAGE');
