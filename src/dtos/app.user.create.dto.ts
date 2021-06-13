import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateUser {
  @MinLength(2)
  @ApiProperty()
  username: string;

  @MinLength(4)
  @ApiProperty()
  password: string;
}
