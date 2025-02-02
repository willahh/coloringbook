import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
// import * as fs from 'fs';
// import * as path from 'path';
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
  async convertImage(
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
    console.log('file', file);
    const svgPath = await this.imageService.convertToVector(file);
    return { message: 'Conversion réussie', svgPath };
  }
}
