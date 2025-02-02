import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '@/config/multer.config';
import { GraphicAssetsModule } from '@/graphic-assets/graphic-assets.module';
import { SupabaseService } from '@/supabase.service';

@Module({
  imports: [MulterModule.register(multerOptions), GraphicAssetsModule],
  controllers: [ImageController],
  providers: [ImageService, SupabaseService],
})
export class ImageModule {}
