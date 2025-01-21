import { join } from 'path';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { multerOptions } from './../config/multer.config'; // Mise à jour du chemin
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from 'src/supabase.service';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import * as sharp from 'sharp';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage', multerOptions))
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    coverImage?: Express.Multer.File, // Rendre le paramètre optionnel
  ) {
    let supabaseFilePath = '';
    const prefix = 'cover_';
    const newFileName = `${prefix}${coverImage.filename}`;

    if (coverImage) {
      // Resize the image
      const resizedImagePath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        newFileName,
      );
      await sharp(coverImage.path)
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .resize(400, 400) // Resize to 400x400 pixels
        .toFile(resizedImagePath);

      // Upload file to Supabase storage
      const supabase = this.supabaseService.getClient();
      const bucketName = 'uploads';

      // Read file from local disk
      const fileStream = createReadStream(resizedImagePath);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(newFileName, fileStream, {
          contentType: coverImage.mimetype,
          duplex: 'half',
        });

      // Remove the files from local disk after upload
      await unlink(coverImage.path);
      await unlink(resizedImagePath);

      if (error) {
        throw new Error(`Error when uploading file: ${error.message}`);
      }

      // Public file path
      supabaseFilePath = data.path;
    }

    return this.booksService.create(createBookDto, supabaseFilePath);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
