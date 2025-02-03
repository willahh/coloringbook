import { Response as ExpressResponse } from 'express';
import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { getMulterOptions } from '@/config/multer.config';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('convert')
  @UseInterceptors(
    FileInterceptor('image', getMulterOptions('./uploads/graphic_asset/full')),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    description: 'Image file to convert to vector format',
    examples: {
      'example-1': {
        value: {
          image: '<binary-data>',
        },
        description: 'Send an image file for conversion',
      },
    },
  })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const svgPath = await this.imageService.convertToVector(file);
    return { message: 'Conversion réussie', svgPath };
  }

  @Get('/:url(*)?')
  @ApiOperation({
    summary: 'Proxy for loading SVG from external URL with CORS handling',
    description: `Charge une image depuis Supabase Storage. L'URL doit commencer par le nom du bucket. 
    Exemple "uploads/graphic_asset/vect/1738524784688-732857514.svg"`,
  })
  @ApiResponse({ status: 200, description: 'Returns the SVG content.' })
  async proxySVG(
    @Param('url') url: string,
    @Req() request: Request,
    @Res() response: ExpressResponse,
  ) {
    try {
      const urlPart1 =
        'https://sdliwenpdqycibocgdzv.supabase.co/storage/v1/object/public/';

      const fullUrl = decodeURIComponent(urlPart1 + url);
      const svgContent = await this.imageService.fetchSVGFromURL(fullUrl);

      response.setHeader('Content-Type', 'image/svg+xml');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', 'GET');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      response.send(svgContent);
    } catch (error) {
      console.error('Error fetching SVG:', error);
      response.status(500).send('Error fetching SVG');
    }
  }
}
