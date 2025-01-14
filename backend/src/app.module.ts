import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import * as dotenv from 'dotenv';

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

let host = '';
if (process.env.DB_INSTANCE_NAME) {
  // prod
  host = `/cloudsql/${process.env.DB_INSTANCE_NAME}/`;
} else {
  host = process.env.DATABASE_HOST;
}
const port = Number(process.env.DATABASE_PORT);
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

console.log('-----');
console.log('Start backend with env variables :');
console.log('host', host);
console.log('port', port);
console.log('user', user);
console.log('database', database);
console.log('-----');

@Module({
  imports: [
    UsersModule,
    BooksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: host,
      port: port,
      username: user,
      password: password,
      database: database,
      entities: ['dist/**/*.entity{.ts,.js}'], // Fix needed to works @see https://docs.nestjs.com/techniques/database
      // synchronize: true, // TODO: Dev only !
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
