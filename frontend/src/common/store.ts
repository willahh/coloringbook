import {
  useDispatch as useDispatchRedux,
  useSelector as useSelectorRedux,
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root.reducer';

export const appStore = configureStore({
  reducer: rootReducer,
});

// Settings from https://redux.js.org/tutorials/essentials/part-2-app-structure
export type AppStore = typeof appStore;
export type RootState = ReturnType<typeof rootReducer>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];

export default appStore;

// "Use throughout your app instead of plain `useDispatch` and `useSelector`"
// https://redux.js.org/tutorials/essentials/part-2-app-structure
export const useDispatch = useDispatchRedux.withTypes<AppDispatch>();
export const useSelector = useSelectorRedux.withTypes<RootState>();
