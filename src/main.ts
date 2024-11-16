import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import supertokens from 'supertokens-node';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { SupertokensExceptionFilter } from './auth/auth.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://pms-app-frontend-5e0feb227e5f.herokuapp.com'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are provided
      transform: true, // Automatically transforms payloads to be instances of DTO classes
    }),
  );
  app.useGlobalFilters(new SupertokensExceptionFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
