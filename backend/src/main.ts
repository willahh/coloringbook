import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';
import { User } from './users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Coloring Book API')
    .setDescription('The Coloring Book API description')
    .setVersion('1.0')
    .addTag('books')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Init
  await app.listen(process.env.PORT ?? 3000);

  // Initialize AppDataSource
  console.log('Initializing the database connection...');
  AppDataSource.initialize();
  console.log('Initialized finished');

  // console.log('Initializing the database connection...');
  // AppDataSource.initialize()
  //   .then(async () => {
  //     console.log('Inserting a new user into the database...');
  //     const user = new User();
  //     user.firstName = 'Timber';
  //     user.lastName = 'Saw';
  //     user.age = 25;
  //     await AppDataSource.manager.save(user);
  //     console.log('Saved a new user with id: ' + user.id);

  //     console.log('Loading users from the database...');
  //     const users = await AppDataSource.manager.find(User);
  //     console.log('Loaded users: ', users);

  //     console.log(
  //       'Here you can setup and run express / fastify / any other framework.',
  //     );
  //   })
  //   .catch((error) => console.log(error));
}
bootstrap();
