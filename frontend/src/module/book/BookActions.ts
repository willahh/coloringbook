import APIService from '@/services/APIService';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { bookDataService } from '@/services/services';
import { Book, Page, Element } from '@apptypes/book';
import { ElementService } from '@/services/ElementService';
import { GraphicAsset } from '@apptypes/graphic-asset.entity';
import { AxiosErrorResponse, BookError } from '@/common/interfaces';
import { trackBookEvent } from '@/common/utils/analyticsEvents';

/**
 * fetchBookByIdAction
 */
export const fetchBookByIdAction = createAsyncThunk<
  {
    book: Book;
    isModified: boolean;
  },
  {
    bookId: number;
  },
  { rejectValue: BookError }
>('BOOKS/FETCH_BOOK_BY_ID', async ({ bookId }, { rejectWithValue }) => {
  try {
    const book = await APIService.fetchBook(bookId);
    const { book: newBook, isModified } =
      bookDataService.normalizeBookData(book);
    return { book: newBook, isModified };
  } catch (error) {
    return rejectWithValue(error as AxiosErrorResponse);
  }
});

/**
 * saveBookAction
 */
export const saveBookAction = createAsyncThunk<
  Book,
  {
    bookId: number;
    book: Book;
  }
>('book/saveBookAction', async ({ bookId, book }) => {
  trackBookEvent('BOOK_SAVE', book);
  const { book: newBook } = bookDataService.normalizeBookData(book);
  const savedBook = await APIService.saveBook(bookId, newBook);
  return savedBook;
});

/**
 * loadBookFromJson
 */
export const loadBookFromJson = createAction<Book>('book/loadBookFromJson');

/**
 * editBookNameAction
 */
export const editBookNameAction = createAsyncThunk<
  Book,
  {
    bookId: number;
    bookName: string;
  }
>('book/editBookNameAction', async ({ bookId, bookName }) => {
  trackBookEvent('BOOK_EDIT_BOOK_NAME', { id: bookId, name: bookName });
  const book = await APIService.updateBook(bookId, { name: bookName });
  return book;
});

/**
 * updateBookAction
 */
export const updateBookAction = createAction<{
  bookId: number;
  book: Book;
}>('book/updateBookAction');

/**
 * addPageAction
 */
export const addPageAction = createAction<{
  page: Page;
}>('page/addPageAction');

/**
 * deletePageAction
 */
export const deletePageAction = createAction<{
  pageId: number;
}>('page/deletePageAction');

/**
 * AddGraphicAssetToPageAction
 */
export interface AddGraphicAssetToPagePayload {
  graphicAsset: GraphicAsset;
  pageId: number;
}

export const AddGraphicAssetToPageAction = createAsyncThunk<
  {
    pageId: number;
    element: Element;
  },
  {
    graphicAsset: GraphicAsset;
    pageId: number;
  }
>('asset/AddGraphicAssetToPageAction', ({ pageId, graphicAsset }) => {
  trackBookEvent('BOOK_ELEMENT_ADD_TO_PAGE', { id: 0, name: '' });
  const element = ElementService.getElementFromGraphicAsset(graphicAsset);
  return { pageId: pageId, element: element };
});

/**
 * updatePageThumbImageData
 */
export const updatePageThumbImageData = createAction<{
  thumbnails: { [key: number]: string };
}>('book/updatePageThumbImageData');
