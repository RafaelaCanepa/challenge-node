import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {Logger} from '@nestjs/common';
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  const port = 3000;
  await app.listen(port);
  logger.log(`Server is running on port ${port}`);
}
bootstrap();
