import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((response: any) => {
        const message = response?.message ?? 'Success';

        const data = response?.data ?? response;

        return {
          status: 'success',
          message,
          data,
          timestamp: new Date().toISOString(),
          path: req.url,
        };
      }),
    );
  }
}
