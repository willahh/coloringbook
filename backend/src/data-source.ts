import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';

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

export const options: DataSourceOptions = {
  type: 'postgres',
  host: host,
  port: port,
  username: user,
  password: password,
  database: database,
  entities: [User, Book],
  // synchronize: true,
  logging: true,
};

export const AppDataSource = new DataSource(options);
