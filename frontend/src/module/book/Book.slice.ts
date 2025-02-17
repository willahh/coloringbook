import { createSlice } from '@reduxjs/toolkit';
import * as bookActions from './Book.actions.ts';
import * as elementActions from './element/Element.action.ts';
import { Book } from '@apptypes/book.ts';
import { GraphicAsset } from '@apptypes/graphic-asset.entity.ts';
import { BookFormat } from '@apptypes/book.enum.ts';
import { RootState } from '@/common/store.ts';

interface BookState {
  book: Book;
  areLocalUpdatesSaved: boolean;
  refreshGraphics: boolean;
  graphicAssets: GraphicAsset[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookState = {
  book: {
    coverImage: '',
    format: BookFormat.A4_PORTRAIT,
    id: 0,
    name: '',
    pageCount: 0,
    pages: [],
  },
  areLocalUpdatesSaved: true,
  refreshGraphics: false,
  graphicAssets: [],
  isLoading: false,
  error: null,
};

export const selectIsLoading = (state: RootState) => state.book.isLoading;
export const selectBook = (state: RootState) => state.book;

const slice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    /**
     * fetchBookByIdAction
     */
    builder.addCase(bookActions.fetchBookByIdAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      bookActions.fetchBookByIdAction.fulfilled,
      (state, { payload: { book, isModified } }) => {
        state.isLoading = false;
        state.error = null;
        state.book = book;
        state.areLocalUpdatesSaved = !isModified;
      }
    );

    /**
     * saveBookAction
     */
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

    /**
     * updateBookAction
     */
    builder.addCase(
      bookActions.updateBookAction,
      (state, { payload: { book } }) => {
        state.book = book;
      }
    );

    /**
     * editBookNameAction
     */
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

    /**
     * addPageAction
     */
    builder.addCase(
      bookActions.addPageAction,
      (state, { payload: { page } }) => {
        state.book.pages.push(page);
        state.areLocalUpdatesSaved = false;
      }
    );

    /**
     * deletePageAction
     */
    builder.addCase(
      bookActions.deletePageAction,
      (state, { payload: { pageId } }) => {
        state.book.pages = state.book.pages.filter(
          (page) => page.pageId !== pageId
        );
        state.areLocalUpdatesSaved = false;
      }
    );

    /**
     * AddGraphicAssetToPageAction
     */
    builder.addCase(
      bookActions.AddGraphicAssetToPageAction.pending,
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      bookActions.AddGraphicAssetToPageAction.fulfilled,
      (state, { payload: { element, pageId } }) => {
        const pageIndex = state.book.pages.findIndex(
          (p) => p.pageId === pageId
        );

        if (pageIndex !== -1) {
          state.book.pages = state.book.pages.map((page, index) => {
            if (index === pageIndex) {
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

    /**
     * addElementToPage
     */
    builder.addCase(
      elementActions.addElementToPage.fulfilled,
      (state, { payload: { element, pageId } }) => {
        const pageIndex = state.book.pages.findIndex(
          (p) => p.pageId === pageId
        );
        if (pageIndex !== -1) {
          state.book.pages = state.book.pages.map((page, index) => {
            if (index === pageIndex) {
              return {
                ...page,
                elements: [...page.elements, element],
              };
            }
            return page;
          });
          state.areLocalUpdatesSaved = false;
        }
      }
    );

    /**
     * updateElementByElementId
     */
    builder.addCase(
      elementActions.updateElementByElementId.fulfilled,
      (state, { payload: { element, pageId } }) => {
        const pageIndex = state.book.pages.findIndex(
          (p) => p.pageId === pageId
        );
        if (pageIndex !== -1) {
          const elementIndex = state.book.pages[pageIndex].elements.findIndex(
            (el) => el.elementId === element.elementId
          );

          if (elementIndex !== -1) {
            console.log('=> element', element);
            state.book.pages[pageIndex].elements[elementIndex] = element;
            state.areLocalUpdatesSaved = false;
          } else {
            console.error('Element not found for update:', element.elementId);
          }
        } else {
          console.error('Page not found for update:', pageId);
        }
      }
    );

    /**
     * removeElementByPageIdAndElementId
     */
    builder.addCase(
      elementActions.removeEementByPageIdAndElementId.fulfilled,
      (state, { payload: { pageId, elementId } }) => {
        const pageIndex = state.book.pages.findIndex(
          (p) => p.pageId === pageId
        );
        if (pageIndex !== -1) {
          state.book.pages = state.book.pages.map((page, index) => {
            if (index === pageIndex) {
              return {
                ...page,
                elements: page.elements.filter(
                  (el) => el.elementId !== elementId
                ),
              };
            }
            return page;
          });
          state.areLocalUpdatesSaved = false;
        }
      }
    );
  },
});

export default slice.reducer;
