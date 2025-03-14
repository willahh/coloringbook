import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { delayMiddleware } from '@/middlewares/delay.middleware';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Charger les certificats SSL
  // const privateKey = fs.readFileSync(
  //   './../documents/cert/192.168.1.67-key.pem',
  //   'utf8',
  // );
  // const certificate = fs.readFileSync(
  //   './../documents/cert/192.168.1.67.pem',
  //   'utf8',
  // );

  // const credentials = { key: privateKey, cert: certificate };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // httpsOptions: credentials, // Activer HTTPS avec les certificats
  });

  // Increase the limit for JSON payloads
  app.use(bodyParser.json({ limit: '50mb' }));

  // Increase the limit for URL-encoded bodies
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(delayMiddleware);

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL ?? 'http://localhost:5173', // Mettre à jour pour HTTPS
      'http://192.168.1.67:5173',
      'http://192.168.1.67:49665',

      'https://192.168.1.67:5173',
      'https://192.168.1.67:49665',

      'https://coloringbook-backend.onrender.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Serve static files from the uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/media/',
  });

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
  await app.listen(port, '0.0.0.0'); // Écoute sur toutes les interfaces
  console.log('Listening finished');

  const url = await app.getUrl();
  console.log(`You can consult the API with the Swagger on ${url}/api`);
}

bootstrap();
