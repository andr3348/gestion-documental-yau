import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // elimina propiedades no definidas en los DTOs
  app.setGlobalPrefix('api'); // todas las rutas tendrán el prefijo /api
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true, // imprescindible para que el browser envíe cookies
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
