import { GraphicAssetType } from './graphic-asset-type.enum';

export interface GraphicAsset {
  id: number;
  name: string;
  type: GraphicAssetType;
  path: string;
  fullPath: string;
  vectPath: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
