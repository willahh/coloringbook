import APIService from '@/services/api.service';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { BookService } from '@/services/book.service';
import { Book, Page, Element } from '@apptypes/book';
import { ElementService } from '@/services/element.service';
import { GraphicAsset } from '@apptypes/graphic-asset.entity';
// import { PageService } from '@/services/page.service';

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * BOOKS_FETCH_BOOK_BY_ID
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface FetchBookByIdActionPayload {
  bookId: number;
}
interface FetchBookByIdActionResponse {
  book: Book;
  isModified: boolean;
}
export const fetchBookByIdAction = createAsyncThunk<
  FetchBookByIdActionResponse,
  FetchBookByIdActionPayload
>('BOOKS/FETCH_BOOK_BY_ID', async ({ bookId }) => {
  const book = await APIService.fetchBook(bookId);
  const { book: newBook, isModified } = BookService.prepareBookData(book);

  return { book: newBook, isModified };
});

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * BOOKS_SAVE_BOOK
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface SaveBookActionPayload {
  bookId: number;
  book: Book;
}
export const saveBookAction = createAsyncThunk<Book, SaveBookActionPayload>(
  'BOOKS/BOOKS_SAVE_BOOK',
  async ({ bookId, book }) => {
    const savedBook = await APIService.updateBook(bookId, book);

    return savedBook;
  }
);

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * BOOKS_EDIT_BOOK_NAME
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface EditBookNamePayload {
  bookId: number;
  bookName: string;
}
export const editBookNameAction = createAsyncThunk<Book, EditBookNamePayload>(
  'BOOKS/EDIT_BOOK_NAME',
  async ({ bookId, bookName }) => {
    const book = await APIService.updateBook(bookId, { name: bookName });
    return book;
  }
);

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * BOOKS_UPDATE_BOOK
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface UpdateBookPayload {
  bookId: number;
  book: Book;
}
export const updateBookAction =
  createAction<UpdateBookPayload>('BOOKS/UPDATE_BOOK');

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * PAGES_ADD_PAGE
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface AddPagePayload {
  page: Page;
}
export const addPageAction = createAction<AddPagePayload>('PAGES/ADD_PAGE');

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * PAGES_DELETE_PAGE
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface DeletePagePayload {
  pageId: number;
}
export const deletePageAction =
  createAction<DeletePagePayload>('PAGES/DELETE_PAGE');

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * PAGES_ADD_GRAPHIC_ASSET_TO_PAGE
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface AddGraphicAssetToPagePayload {
  graphicAsset: GraphicAsset;
  pageId: number;
}
interface AddGraphicAssetToPageResponse {
  pageId: number;
  element: Element;
}
export const AddGraphicAssetToPageAction = createAsyncThunk<
  AddGraphicAssetToPageResponse,
  AddGraphicAssetToPagePayload
>('PAGES_ADD_GRAPHIC_ASSET_TO_PAGE', ({ pageId, graphicAsset }) => {
  const element = ElementService.getElementFromGraphicAsset(graphicAsset);
  return { pageId: pageId, element: element };
});
