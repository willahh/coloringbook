import { createAsyncThunk } from '@reduxjs/toolkit';

import APIService from '@/services/api.service';
import { BookService } from '@/services/book.service';
import { Book } from '@apptypes/book';

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * BOOKS_FETCH_BOOK_BY_ID
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export interface FetchBookByIdActionPayload {
  bookId: number;
}
export interface FetchBookByIdActionResponse {
  book: Book;
  isModified: boolean;
}
export const fetchBookByIdAction = createAsyncThunk<
  FetchBookByIdActionResponse,
  FetchBookByIdActionPayload
>('BOOKS/FETCH_BOOK_BY_ID', async ({ bookId }) => {
  const book = await APIService.fetchBook(bookId);
  const { book: newBook, isModified } = BookService.normalizeBookData(book);

  return { book: newBook, isModified: isModified };
});
