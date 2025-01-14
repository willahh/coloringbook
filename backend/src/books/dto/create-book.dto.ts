import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BookFormat } from '../entities/book.enum';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsEnum(BookFormat)
  format: BookFormat;

  @IsNotEmpty()
  @IsNumber()
  pageCount: number;

  @IsOptional()
  pages: Array<object>;
}
