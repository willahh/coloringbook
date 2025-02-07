import { createAsyncThunk } from '@reduxjs/toolkit';

import APIService from '@/services/api.service';
import { GraphicAsset } from '@/types/graphic-asset.entity';

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * GRAPHIC_ASSETS/FETCH_GRAPHIC_ASSETS
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export const fetchGraphicAssetsAction = createAsyncThunk<GraphicAsset[]>(
  'GRAPHIC_ASSETS/FETCH_GRAPHIC_ASSETS',
  async () => {
    const graphicAssets = await APIService.fetchGraphicAssets();

    return graphicAssets;
  }
);
