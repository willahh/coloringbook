import APIService from '@/services/api.service';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { BookService } from '@/services/book.service';
import { Book, Page, Element } from '@apptypes/book';
import { ElementService } from '@/services/element.service';
import { GraphicAsset } from '@apptypes/graphic-asset.entity';
import { AxiosErrorResponse, BookError } from '@/common/interfaces';

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
    const { book: newBook, isModified } = BookService.normalizeBookData(book);
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
  const { book: newBook } = BookService.normalizeBookData(book);
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
  const element = ElementService.getElementFromGraphicAsset(graphicAsset);
  return { pageId: pageId, element: element };
});

/**
 * updatePageThumbImageData
 */
export const updatePageThumbImageData = createAction<{
  thumbnails: { [key: number]: string };
}>('book/updatePageThumbImageData');
