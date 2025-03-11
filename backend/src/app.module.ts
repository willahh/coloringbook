import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/users/users.module';
import { BooksModule } from '@/books/books.module';
import { options } from '@/data-source';
import { GraphicAssetsModule } from './graphic-assets/graphic-assets.module';
import { ImageModule } from './image/image.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    GraphicAssetsModule,
    ImageModule,
    TypeOrmModule.forRoot(options),
    NewsletterModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
