import {
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  Catch,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseErrorType } from '@commontypes';
import {
  CORRELATION_HEADER_KEY,
  INTERNAL_SERVER_ERROR,
} from '@commonconstants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ResponseErrorType = {
      error: {
        status,
        correlationId: request.headers[CORRELATION_HEADER_KEY] as string,
        path: request.url,
        method: request.method,
        message:
          status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? exception.message.error || exception.message || null
            : INTERNAL_SERVER_ERROR,
        details:
          status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? exception.message?.message
            : undefined,
      },
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(`${request.method} ${request.url}`, exception.stack);
    } else {
      Logger.error(
        `${request.method} ${request.url} ${errorResponse.error.message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
