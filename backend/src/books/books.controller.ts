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
    @UploadedFile() coverImage?: Express.Multer.File, // Rendre le paramètre optionnel
  ) {
    if (coverImage) {
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }).transform(coverImage);
    }

    // Upload file to Supabase storage
    const supabase = this.supabaseService.getClient();
    const bucketName = 'uploads';

    // Read file from local disk
    const filePath = join(__dirname, '..', '..', coverImage.path);
    const fileStream = createReadStream(filePath);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(coverImage.originalname, fileStream, {
        contentType: coverImage.mimetype,
        duplex: 'half',
      });

    if (error) {
      throw new Error(`Error when uploading file: ${error.message}`);
    }

    // Public file path
    const supabaseFilePath = data.path;

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
