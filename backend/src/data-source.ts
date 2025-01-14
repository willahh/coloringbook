import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'postgres',
  synchronize: true,
  logging: false,
  entities: [User, Book],
  migrations: [],
  subscribers: [],
});
