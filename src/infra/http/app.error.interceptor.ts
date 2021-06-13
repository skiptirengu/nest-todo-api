import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthError } from 'src/infra/errors/app.auth.error';
import { DuplicatedEntityError } from 'src/infra/errors/app.duplicated-entity.error';
import { EntityNotFoundError } from 'src/infra/errors/app.entity-not-found.error';

export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(catchError((error) => throwError(mapErrorToHttpException(error))));
  }
}

function mapErrorToHttpException(error: any) {
  if (error instanceof DuplicatedEntityError) {
    return new BadRequestException(error.message);
  } else if (error instanceof EntityNotFoundError) {
    return new NotFoundException(error.message);
  } else if (error instanceof AuthError) {
    return new ForbiddenException(error.message);
  } else {
    return new InternalServerErrorException();
  }
}
