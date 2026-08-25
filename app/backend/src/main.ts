import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from '@/app.module';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { isDevelopment } from './utils/check-env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const PORT = Number(process.env.PORT ?? 8000);

  // Enable and app using helper
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Middlewares
  app.use(helmet());
  app.use(cookieParser());

  // This is for the swagger docs, it by default is only available in development
  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('API description')
      .setVersion('1.0')
      .addCookieAuth('session')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}
void bootstrap();
