import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// from: https://redux.js.org/tutorials/essentials/part-2-app-structure
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
