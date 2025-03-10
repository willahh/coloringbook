import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '@/module/book/BookSlice';
import graphicAssetsReducer from '@/module/book/sidePanel/graphicAssets/GraphicAssets.slice';

const rootReducer = combineReducers({
  book: bookReducer,
  graphicAssets: graphicAssetsReducer,
});

export default rootReducer;
