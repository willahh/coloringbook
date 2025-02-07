import { createAsyncThunk } from '@reduxjs/toolkit';

import APIService from '@/services/api.service';
import { GraphicAsset } from '@/types/graphic-asset.entity';

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * fetchGraphicAssetsAction
 *–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
export const fetchGraphicAssetsAction = createAsyncThunk<GraphicAsset[]>(
  'GRAPHIC_ASSETS/FETCH_GRAPHIC_ASSETS',
  async () => {
    const graphicAssets = await APIService.fetchGraphicAssets();

    return graphicAssets;
  }
);
