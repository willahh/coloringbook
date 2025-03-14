import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { SvgConversionService } from './svg-conversion.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

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

  @Get('svg-content/:svgPath(*)')
  async getSvgContent(@Param('svgPath') svgPath: string, @Res() res: Response) {
    try {
      const svgContent = await this.svgConversionService.getSvgContent(svgPath);
      res.setHeader('Content-Type', 'text/plain');
      res.send(svgContent);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve SVG content',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('save')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileName: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
        svgContent: {
          type: 'string',
        },
      },
    },
  })
  async saveSvg(
    @UploadedFile() file: Express.Multer.File,
    @Body('svgContent') svgContent: string,
    @Body('fileName') fileName: string,
  ) {
    return this.svgConversionService.saveSvgAndConvert(
      fileName,
      svgContent || file.buffer.toString(),
    );
  }

  @Get('svg-converted-list')
  @ApiOperation({ summary: 'Get list of converted SVG files with thumbnails' })
  @ApiResponse({
    status: 200,
    description: 'List of SVG files with their PNG thumbnails',
    type: Array,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          thumb: { type: 'string' },
        },
      },
    },
  })
  async getSvgConvertedList() {
    return this.svgConversionService.getSvgConvertedList();
  }

  @Get('svg/:filePath(*)')
  @ApiOperation({ summary: 'Get SVG content from file path' })
  @ApiResponse({
    status: 200,
    description: 'SVG content as string',
    type: String,
  })
  @ApiResponse({ status: 404, description: 'SVG file not found' })
  async getSvgContentFromPath(@Param('filePath') filePath: string) {
    try {
      const svgContent =
        await this.svgConversionService.getSvgContentFromPath(filePath);
      return svgContent;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve SVG content from path',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
