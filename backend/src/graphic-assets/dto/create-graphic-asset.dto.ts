import { IsString, IsOptional } from 'class-validator';
import { GraphicAssetType } from '../entities/graphic-asset-type.enum';

export class CreateGraphicAssetDto {
  @IsString()
  name: string;

  @IsString()
  type: GraphicAssetType;

  @IsString()
  path: string;

  @IsString()
  @IsOptional()
  fullPath: string;

  @IsString()
  @IsOptional()
  vectPath: string;

  @IsString()
  @IsOptional()
  description?: string;
}
