import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CONTEXT, HTTP } from 'src/constants/app.http.constants';
import { UserService } from 'src/services/app.user.service';
import { Request } from 'express';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly authService: UserService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers[HTTP.tokenHeaderName] as string;
    const userId = this.authService.verifyToken(token);
    request.res.locals[CONTEXT.userIdKey] = userId;
    return next.handle();
  }
}
