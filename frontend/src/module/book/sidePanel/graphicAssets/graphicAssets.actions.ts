import { createAsyncThunk } from '@reduxjs/toolkit';

import APIService from '@/services/APIService';
import { GraphicAsset } from '@apptypes/graphic-asset.entity';

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
