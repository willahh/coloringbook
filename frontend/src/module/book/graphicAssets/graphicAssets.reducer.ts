import { createSlice } from '@reduxjs/toolkit';
import initialState from './graphicAssets.state.ts';
import * as graphicAssetsActions from './graphicAssets.actions.ts';

const graphicAssetsSlice = createSlice({
  name: 'graphicAssets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * BOOKS_FETCH_BOOK_BY_ID
     *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    builder.addCase(
      graphicAssetsActions.fetchGraphicAssetsAction.pending,
      (state) => {
        state.error = false;
        state.isLoading = true;
      }
    );
    builder.addCase(
      graphicAssetsActions.fetchGraphicAssetsAction.fulfilled,
      (state, { payload }) => {
        const graphicAssets = payload;

        state.isLoading = false;
        state.error = false;
        state.graphicAssets = graphicAssets;
      }
    );
    builder.addCase(
      graphicAssetsActions.fetchGraphicAssetsAction.rejected,
      (state) => {
        state.error = true;
      }
    );
  },
});

export default graphicAssetsSlice.reducer;
