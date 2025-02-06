import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './module/book/book.reducer.ts';

export const appStore = configureStore({
  reducer: {
    book: bookReducer,
  },
});

// Settings from https://redux.js.org/tutorials/essentials/part-2-app-structure
export type AppStore = typeof appStore
export type RootState = ReturnType<typeof appStore.getState>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];

export default appStore;
