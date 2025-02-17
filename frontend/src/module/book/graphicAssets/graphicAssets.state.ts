import { RootState } from '@/common/store';
import { GraphicAsset } from '@apptypes/graphic-asset.entity';

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

const initialGraphicAssetState: GraphicAssetsState = {
  error: undefined,
  isLoading: false,
  selectedId: undefined,
  graphicAssets: [],
  mode: Mode.Default,
};

export const selectAllGraphicAssets = (state: RootState) => state;

export default initialGraphicAssetState;
