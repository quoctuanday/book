import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const { method, url } = req || { method: 'unknown', url: 'unknown' };

    const start = Date.now();
    this.logger.log(`[Request] ${method} ${url}`);

    return next.handle().pipe(
      catchError((err) => {
        const elapsed = Date.now() - start;
        const status = res?.statusCode ?? 'ERR';

        this.logger.error(
          `[Error] ${method} ${url} status=${status} ${elapsed}ms`,
          err?.stack ?? err?.message,
        );

        throw err;
      }),

      finalize(() => {
        const elapsed = Date.now() - start;
        const status = res?.statusCode ?? '-';

        this.logger.log(
          `[Response] ${method} ${url} status=${status} time=${elapsed}ms`,
        );
      }),
    );
  }
}
