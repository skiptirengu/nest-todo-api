import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';
import { HTTP } from 'src/constants/app.http.constants';
import { ErrorInterceptor } from 'src/infra/http/app.error.interceptor';

const appConfig: NestApplicationOptions = {
  logger: ['error', 'warn', 'log'],
  cors: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appConfig);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('Simple Todo API')
    .setVersion('1.0')
    .addApiKey(
      { in: 'header', name: HTTP.tokenHeaderName, type: 'apiKey' },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3003);
}

bootstrap();
