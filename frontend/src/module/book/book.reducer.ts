import { createSlice /*, PayloadAction*/ } from '@reduxjs/toolkit';
import initialState from './book.state.ts';
import {
  addPageAction,
  deletePageAction,
  editBookNameAction,
  fetchBookByIdAction,
  updateBookAction,
} from './book.actions.ts';


// TODO: Create a new Reducer for Canvas, canvas.reducer.ts 
// => width / height, etc
const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * BOOKS_FETCH_BOOK_BY_ID
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(fetchBookByIdAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchBookByIdAction.fulfilled,
      (state, { payload: book }) => {
        state.isLoading = false;
        state.error = null;
        state.book = book;
      }
    );

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * BOOKS_UPDATE_BOOK
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(updateBookAction, (state, { payload: { book } }) => {
      state.book = book;
    });

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * BOOKS_EDIT_BOOK_NAME
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(editBookNameAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      editBookNameAction.fulfilled,
      (state, { payload: book }) => {
        state.isLoading = false;
        state.error = null;
        state.book = book;
      }
    );

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * PAGES_ADD_PAGE
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(addPageAction, (state, { payload: { page } }) => {
      state.book.pages.push(page);
      state.areLocalUpdatesSaved = false;
    });

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * PAGES_DELETE_PAGE
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(deletePageAction, (state, { payload: { pageId } }) => {
      state.book.pages = state.book.pages.filter(
        (page) => page.pageId !== pageId
      );
      state.areLocalUpdatesSaved = false;
    });
  },
});

export default bookSlice.reducer;
