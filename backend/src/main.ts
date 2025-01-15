import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Documentation
  const config = new DocumentBuilder()
    .setTitle('Coloring Book API')
    .setDescription('The Coloring Book API description')
    .setVersion('1.0')
    .addTag('books')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // Swagger
  SwaggerModule.setup('api', app, documentFactory);

  // Init
  const port = process.env.PORT ?? 3000;
  console.log('Listening on port', port);
  await app.listen(port);
  console.log('Listening finished');

  const url = await app.getUrl();
  console.log(`You can consult the API with the Swagger on ${url}/api`);
}
bootstrap();
