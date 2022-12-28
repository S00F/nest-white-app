import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { validateSync, ValidationError } from 'class-validator';

/**
 *
 *
 * @export
 * @interface Response
 * @template T
 */
export interface Response<T> {
  data: T;
}

/**
 *
 *
 * @export
 * @class HttpClientResponseValidatorInterceptor
 * @implements {NestInterceptor<Response<T>>}
 * @template T
 */
@Injectable()
export class HttpClientResponseValidatorInterceptor<T>
  implements NestInterceptor<Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(r => {
        const errors: ValidationError[] = validateSync(r, {
          validationError: { target: false, value: true },
        });
        if (errors && errors.length > 0)
          throw new UnprocessableEntityException(JSON.stringify(errors));
        return r;
      }),
    );
  }
}
