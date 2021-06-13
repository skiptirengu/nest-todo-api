import { Controller, Get, HttpCode } from '@nestjs/common';
import { DateTime } from 'luxon';

@Controller()
export class AppController {
  @Get('status')
  @HttpCode(200)
  getStatus(): Record<string, any> {
    return { status: 'ok', serverTime: DateTime.utc().toMillis() };
  }
}
