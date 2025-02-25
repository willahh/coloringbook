import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Book } from '@/books/entities/book.entity';
import { Init1736932735124 } from '@/migrations/1736932735124-init';
import { BookAddColumnCoverImage1737027990891 } from '@/migrations/1737027990891-book-add-column-coverImage';
import { UpdateBookTable1738267032267 } from './migrations/1738267032267-update-book-table';
import { AddGraphicAssetsTable1738268290034 } from './migrations/1738268290034-add-graphic-assets-table';
import { GraphicAsset } from './graphic-assets/entities/graphic-asset.entity';
import { UpdateGraphicTable1738268956723 } from './migrations/1738268956723-update-graphic-table';
import { UpdateGraphicTable1738520339796 } from './migrations/1738520339796-update-graphic-table';
import { UpdateGraphicTable1738520517876 } from './migrations/1738520517876-update-graphic-table';
import { UpdateBookEntity1738581096732 } from './migrations/1738581096732-update-book-entity';
import { Newsletter } from './newsletter/newsletter.entity';
import { AddNewsletterEntity1740520521395 } from './migrations/1740520521395-add-newsletter-entity';
import { UpdateNewsletterEntity1740521986608 } from './migrations/1740521986608-update-newsletter-entity';

// Load environment variables based on the environment
let envFile =
  process.env.NODE_ENV === 'production'
    ? 'production.env'
    : process.env.NODE_ENV === 'staging'
      ? 'staging.env'
      : '.env';

envFile += '';
envFile = 'production.env'; // Uncomment me to run production migration scripts

dotenv.config({ path: 'env/' + envFile });

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;
const ssl = process.env.DATABASE_SSL || false;

console.log('-----');
console.log('Start backend with env variables :');
console.log('envFile: ', envFile);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
console.log('ssl: ', ssl);
console.log('host: ', host);
console.log('port: ', port);
console.log('user: ', user);
console.log('password: ', '*********');
console.log('database: ', database);
console.log('-----');

const optionsWithSSL = {
  ssl: true,
  sslMode: 'require',
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

export const options: DataSourceOptions = {
  type: 'postgres',
  host: host,
  port: port,
  username: user,
  password: password,
  database: database,
  entities: [User, Book, GraphicAsset, Newsletter],
  // entities: ['src/**/entities/*.entity.ts'],
  migrations: [
    Init1736932735124,
    BookAddColumnCoverImage1737027990891,
    UpdateBookTable1738267032267,
    AddGraphicAssetsTable1738268290034,
    UpdateGraphicTable1738268956723,
    UpdateGraphicTable1738520339796,
    UpdateGraphicTable1738520517876,
    UpdateBookEntity1738581096732,
    AddNewsletterEntity1740520521395,
    UpdateNewsletterEntity1740521986608,
  ],
  synchronize: false,
  logging: true,
  ...(ssl ? optionsWithSSL : {}),
};

console.log('Initialize and export the data source for database connection');
export const AppDataSource = new DataSource(options);

AppDataSource.initialize();
console.log('Data source initialized');
