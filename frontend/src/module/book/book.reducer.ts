import { createSlice } from '@reduxjs/toolkit';
import initialState from './book.state.ts';
import * as bookActions from './book.actions.ts';

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
    builder.addCase(bookActions.fetchBookByIdAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      bookActions.fetchBookByIdAction.fulfilled,
      (state, { payload: {book, isModified} }) => {
        state.isLoading = false;
        state.error = null;
        state.book = book;
        state.areLocalUpdatesSaved = !isModified;
      }
    );

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * BOOKS_SAVE_BOOK
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(bookActions.saveBookAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.areLocalUpdatesSaved = false;
    });
    builder.addCase(
      bookActions.saveBookAction.fulfilled,
      (state, { payload: book }) => {
        state.isLoading = false;
        state.error = null;
        state.areLocalUpdatesSaved = true;
        state.book = book;
      }
    );

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * BOOKS_UPDATE_BOOK
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(
      bookActions.updateBookAction,
      (state, { payload: { book } }) => {
        state.book = book;
      }
    );

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * BOOKS_EDIT_BOOK_NAME
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(bookActions.editBookNameAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      bookActions.editBookNameAction.fulfilled,
      (state, { payload: book }) => {
        state.isLoading = false;
        state.error = null;
        state.book = book;
      }
    );

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * PAGES_ADD_PAGE
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(
      bookActions.addPageAction,
      (state, { payload: { page } }) => {
        state.book.pages.push(page);
        state.areLocalUpdatesSaved = false;
      }
    );

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * PAGES_DELETE_PAGE
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(
      bookActions.deletePageAction,
      (state, { payload: { pageId } }) => {
        state.book.pages = state.book.pages.filter(
          (page) => page.pageId !== pageId
        );
        state.areLocalUpdatesSaved = false;
      }
    );

    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * PAGES_ADD_GRAPHIC_ASSET_TO_PAGE
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(
      bookActions.AddGraphicAssetToPageAction.pending,
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      bookActions.AddGraphicAssetToPageAction.fulfilled,
      (state, { payload: { element, pageId } }) => {
        console.log('#5 AddGraphicAssetToPageAction');
        const pageIndex = state.book.pages.findIndex(
          (p) => p.pageId === pageId
        );
        console.log('#5 pageIndex', pageIndex);

        if (pageIndex !== -1) {
          // Utilisez l'opérateur spread (...) pour créer une nouvelle copie de l'array et de l'objet page
          state.book.pages = state.book.pages.map((page, index) => {
            if (index === pageIndex) {
              // Créez une nouvelle copie de la page avec le nouvel élément ajouté
              return {
                ...page,
                elements: [...page.elements, element],
              };
            }
            return page;
          });
        }
        state.isLoading = false;
        state.areLocalUpdatesSaved = false;
      }
    );
  },
});

export default bookSlice.reducer;
