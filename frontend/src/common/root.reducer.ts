import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '@/module/book/BookSlice';

const rootReducer = combineReducers({
  book: bookReducer,
});

export default rootReducer;
