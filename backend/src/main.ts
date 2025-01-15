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
  console.log(
    'You can consult the API with the Swagger on http://localhost:3000/api',
  );

  // Init
  const port = process.env.PORT ?? 3000;
  console.log('Listening on port', port);
  await app.listen(port);
  console.log('Listening finished');
}
bootstrap();
