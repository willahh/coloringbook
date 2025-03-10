import { Module } from '@nestjs/common';
import { SvgConversionService } from './svg-conversion.service';
import { SvgConversionController } from './svg-conversion.controller';

@Module({
  controllers: [SvgConversionController],
  providers: [SvgConversionService],
  exports: [SvgConversionService], // Export si nécessaire pour d'autres modules
})
export class SvgConversionModule {}
