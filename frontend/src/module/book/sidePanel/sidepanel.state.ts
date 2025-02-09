// import { RootState } from '@/common/store';
import { TabType } from './sidepanel.types';
interface SidePanelState {
  isOpen: true;
  width: number; // In pixel
  selectedTab: TabType;
}

const initialState: SidePanelState = {
  isOpen: true,
  width: 500,
  selectedTab: TabType.Element,
  // areLocalUpdatesSaved: true,
  // refreshGraphics: false,
  // graphicAssets: [],
  // isLoading: false,
  // error: null,
};

// export const selectIsLoading = (state: RootState) => state.book.isLoading;
// export const selectBook = (state: RootState) => state.book;

export default initialState;
