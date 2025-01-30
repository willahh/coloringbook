import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/users/users.module';
import { BooksModule } from '@/books/books.module';
import { options } from '@/data-source';
import { GraphicAssetsModule } from './graphic-assets/graphic-assets.module';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    GraphicAssetsModule,
    TypeOrmModule.forRoot(options),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
