import {
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DuplicatedEntityError } from 'src/infra/errors/app.duplicated-entity.error';
import { EntityNotFoundError } from 'src/infra/errors/app.entity-not-found.error';

export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof DuplicatedEntityError) {
      super.catch(new BadRequestException(exception.message), host);
    } else if (exception instanceof EntityNotFoundError) {
      super.catch(new NotFoundException(exception.message), host);
    } else {
      super.catch(exception, host);
    }
  }
}
