import { createSlice } from '@reduxjs/toolkit';
import { TabType } from './Sidepanel.types';

interface SidePanelState {
  isOpen: true;
  width: number; // In pixel
  selectedTab: TabType;
}

const initialState: SidePanelState = {
  isOpen: true,
  width: 500,
  selectedTab: TabType.Element,
};


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
