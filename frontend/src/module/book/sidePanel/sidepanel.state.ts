// import { RootState } from '@/common/store';

export enum Tab {
  Draw,
  Text,
  Shape,
  Background,
  Import,
  Current,
  Parameters,
}
interface SidePanelState {
  isOpen: true;
  width: number; // In pixel
  selectedTab: Tab;
}

const initialState: SidePanelState = {
  isOpen: true,
  width: 500,
  selectedTab: Tab.Draw,
  // areLocalUpdatesSaved: true,
  // refreshGraphics: false,
  // graphicAssets: [],
  // isLoading: false,
  // error: null,
};

// export const selectIsLoading = (state: RootState) => state.book.isLoading;
// export const selectBook = (state: RootState) => state.book;

export default initialState;
