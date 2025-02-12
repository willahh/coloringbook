import APIService from '@/services/api.service';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { BookService } from '@/services/book.service';
import { Book, Page, Element } from '@apptypes/book';
import { ElementService } from '@/services/element.service';
import { GraphicAsset } from '@apptypes/graphic-asset.entity';

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
  }
>('BOOKS/FETCH_BOOK_BY_ID', async ({ bookId }) => {
  const book = await APIService.fetchBook(bookId);
  const { book: newBook, isModified } = BookService.prepareBookData(book);

  return { book: newBook, isModified };
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
>('BOOKS/BOOKS_SAVE_BOOK', async ({ bookId, book }) => {
  const savedBook = await APIService.updateBook(bookId, book);

  return savedBook;
});

/**
 * editBookNameAction
 */
export const editBookNameAction = createAsyncThunk<
  Book,
  {
    bookId: number;
    bookName: string;
  }
>('BOOKS/EDIT_BOOK_NAME', async ({ bookId, bookName }) => {
  const book = await APIService.updateBook(bookId, { name: bookName });
  return book;
});

/**
 * updateBookAction
 */

export const updateBookAction = createAction<{
  bookId: number;
  book: Book;
}>('BOOKS/UPDATE_BOOK');

/**
 * addPageAction
 */
export const addPageAction = createAction<{
  page: Page;
}>('PAGES/ADD_PAGE');

/**
 * deletePageAction
 */
export const deletePageAction = createAction<{
  pageId: number;
}>('PAGES/DELETE_PAGE');

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
>('PAGES_ADD_GRAPHIC_ASSET_TO_PAGE', ({ pageId, graphicAsset }) => {
  const element = ElementService.getElementFromGraphicAsset(graphicAsset);
  return { pageId: pageId, element: element };
});
