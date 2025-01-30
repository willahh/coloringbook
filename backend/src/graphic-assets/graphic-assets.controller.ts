import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GraphicAssetsService } from './graphic-assets.service';
import { CreateGraphicAssetDto } from './dto/create-graphic-asset.dto';
import { UpdateGraphicAssetDto } from './dto/update-graphic-asset.dto';

@Controller('graphic-assets')
export class GraphicAssetsController {
  constructor(private readonly graphicAssetsService: GraphicAssetsService) {}

  @Post()
  create(@Body() createGraphicAssetDto: CreateGraphicAssetDto) {
    return this.graphicAssetsService.create(createGraphicAssetDto);
  }

  @Get()
  findAll() {
    return this.graphicAssetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.graphicAssetsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGraphicAssetDto: UpdateGraphicAssetDto,
  ) {
    return this.graphicAssetsService.update(+id, updateGraphicAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.graphicAssetsService.remove(+id);
  }
}
