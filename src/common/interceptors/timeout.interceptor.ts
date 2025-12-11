import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs = 5000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          console.error(
            `[TIMEOUT] ${req.method} ${req.url} exceeded ${this.timeoutMs}ms`,
          );

          return throwError(
            () =>
              new HttpException(
                {
                  status: 'error',
                  message: 'Request timeout',
                  timeout: this.timeoutMs,
                  path: req.url,
                },
                HttpStatus.REQUEST_TIMEOUT,
              ),
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
