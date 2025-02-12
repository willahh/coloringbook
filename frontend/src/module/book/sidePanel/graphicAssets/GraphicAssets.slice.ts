import { createSlice } from '@reduxjs/toolkit';

import * as graphicAssetsActions from './GraphicAssets.actions.ts';
import { RootState } from '@/common/store';
import { GraphicAsset } from '@/types/graphic-asset.entity';

export enum Mode {
  Default = 'DEFAULT',
  Edit = 'EDIT',
  Delete = 'DELETE',
}

export interface GraphicAssetsState {
  isLoading: boolean;
  error?: boolean;
  graphicAssets: GraphicAsset[];
  selectedId?: number;
  mode: Mode;
}

const initialState: GraphicAssetsState = {
  error: undefined,
  isLoading: false,
  selectedId: undefined,
  graphicAssets: [],
  mode: Mode.Default,
};

export const selectAllGraphicAssets = (state: RootState) => state;

const slice = createSlice({
  name: 'graphicAssets',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     * fetchGraphicAssetsAction
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

export default slice.reducer;
