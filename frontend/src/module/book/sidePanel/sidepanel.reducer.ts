import { createSlice } from '@reduxjs/toolkit';
import initialState from './sidepanel.state.ts';
// import * as sidebarActions from './sidebar.actions.ts';

const sidePanelSlice = createSlice({
  name: 'sidePanel',
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (/*builder*/) => {
    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * BOOKS_FETCH_BOOK_BY_ID
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    // builder.addCase(bookActions.fetchBookByIdAction.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(
    //   bookActions.fetchBookByIdAction.fulfilled,
    //   (state, { payload: book }) => {
    //     state.isLoading = false;
    //     state.error = null;
    //     state.book = book;
    //   }
    // );
  },
});

export default sidePanelSlice.reducer;
