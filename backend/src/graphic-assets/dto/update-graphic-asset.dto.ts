import { PartialType } from '@nestjs/swagger';
import { CreateGraphicAssetDto } from './create-graphic-asset.dto';

export class UpdateGraphicAssetDto extends PartialType(CreateGraphicAssetDto) {}
