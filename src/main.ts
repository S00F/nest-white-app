import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ValidationPipe,
  HttpService,
  UnprocessableEntityException,
} from '@nestjs/common';

import helmet from 'helmet';
import compression from 'compression';


import { CORRELATION_HEADER_KEY } from '@commonconstants';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { SharedModule } from '@modules/shared/shared.module';
import { ConfigurationService } from '@configurationservice';
import { ValidationError } from 'class-validator';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_HTTP_PORT = '1234';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configurationService = app
    .select(SharedModule)
    .get(ConfigurationService);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('WhiteAppNestJS')
    .setDescription('The WhiteAppNestJS API description')
    .setVersion('1.0')
    .addTag('WhiteAppNestJS')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Middlewares
  app.use(helmet());
  app.use(compression());


  // Configs
  app.setGlobalPrefix(configurationService.GLOBAL_PREFIX || '');

  // Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  //Interceptors
  app.useGlobalInterceptors(new LoggerInterceptor());

  // Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
      validationError: { target: false, value: true },
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException(errors),
    }),
  );

  // Mocks
  if (
    !(
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'homologation'
    )
  ) {
    import('../mock-servers/json-mock-server/server').then(jsonMockserver =>
      app.use(jsonMockserver.bootstrap()),
    );
  }

  // Start
  await app.listen(
    configurationService.HTTP_PORT || DEFAULT_HTTP_PORT,
    configurationService.HOST || DEFAULT_HOST,
  );
}
bootstrap();
