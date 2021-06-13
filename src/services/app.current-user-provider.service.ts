import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CONTEXT } from 'src/constants/app.http.constants';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserProvider {
  constructor(@Inject(REQUEST) private request: Request) {}

  id() {
    return this.request.res.locals[CONTEXT.userIdKey];
  }
}
