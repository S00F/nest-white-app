import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggerInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    const call$ = next.handle();
    return call$.pipe(
      tap(() => {
        Logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          ctx.getClass().name,
        );
      }),
    );
  }
}
