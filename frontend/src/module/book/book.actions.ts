import APIService from '@/services/api.service';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { BookService } from '@/services/book.service';
import { Book, Page } from '@/types/book';

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * BOOKS_FETCH_BOOK_BY_ID
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface FetchBookByIdActionPayload {
  bookId: number;
}
export const fetchBookByIdAction = createAsyncThunk<
  Book,
  FetchBookByIdActionPayload
>('BOOKS/FETCH_BOOK_BY_ID', async ({ bookId }) => {
  const book = await APIService.fetchBook(bookId);
  const { book: newBook } = BookService.prepareBookData(book);

  return newBook;
});

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
  book: Book;
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
