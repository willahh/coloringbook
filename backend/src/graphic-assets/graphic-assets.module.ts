import { Module } from '@nestjs/common';
import { GraphicAssetsService } from './graphic-assets.service';
import { GraphicAssetsController } from './graphic-assets.controller';
import { GraphicAsset } from './entities/graphic-asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GraphicAsset])],
  controllers: [GraphicAssetsController],
  providers: [GraphicAssetsService],
  exports: [GraphicAssetsService],
})
export class GraphicAssetsModule {}
