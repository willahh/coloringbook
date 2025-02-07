import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '@/module/book/book.reducer';
import graphicAssetsReducer from '@/module/book/sidePanel/graphicAssets/graphicAssets.reducer';

const rootReducer = combineReducers({
  book: bookReducer,
  graphicAssets: graphicAssetsReducer,
});

export default rootReducer;
