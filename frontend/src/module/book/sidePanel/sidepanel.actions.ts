import { createAsyncThunk } from '@reduxjs/toolkit';

import APIService from '@/services/api.service';
import { BookService } from '@/services/book.service';
import { Book } from '@/types/book';
// import { ElementService } from '@/services/element.service';
// import { GraphicAsset } from '@/types/graphic-asset.entity';
// import { PageService } from '@/services/page.service';

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
  const { book: newBook, isModified } = BookService.prepareBookData(book);

  return { newBook, isModified };
});
