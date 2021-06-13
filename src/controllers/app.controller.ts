import { Controller, Get } from '@nestjs/common';
import { DateTime } from 'luxon';

@Controller()
export class AppController {
  @Get('status')
  getStatus(): Record<string, any> {
    return { status: 'ok', serverTime: DateTime.utc().toMillis() };
  }
}
