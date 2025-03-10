import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SvgConversionService } from './svg-conversion.service';
import { Response } from 'express';

@Controller('image')
export class SvgConversionController {
  constructor(private readonly svgConversionService: SvgConversionService) {}

  @Get('2png/:svgPath(*)')
  async getSvgToPng(@Param('svgPath') svgPath: string, @Res() res: Response) {
    console.log('getSvgToPng', 'svgPath:', svgPath);
    try {
      const pngBuffer =
        await this.svgConversionService.convertSvgToPng(svgPath);
      res.setHeader('Content-Type', 'image/png');
      res.send(pngBuffer);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to convert SVG to PNG',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
