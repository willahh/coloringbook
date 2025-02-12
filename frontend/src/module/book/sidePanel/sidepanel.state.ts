import { TabType } from './Sidepanel.types';
interface SidePanelState {
  isOpen: true;
  width: number; // In pixel
  selectedTab: TabType;
}

const initialState: SidePanelState = {
  isOpen: true,
  width: 500,
  selectedTab: TabType.Element,
};

export default initialState;
