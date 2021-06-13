import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserService } from 'src/services/app.user.service';
import { CreateUser } from 'src/dtos/app.user.create.dto';
import { UserLogin } from 'src/dtos/app.user.login.dto';
import { AuthInterceptor } from 'src/infra/http/app.auth.interceptor';
import { User } from 'src/models/app.user.model';
import { Token } from 'src/models/app.token.model';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('token')
  @UseInterceptors(AuthInterceptor)
  @Get('me')
  @HttpCode(200)
  get(): User {
    return this.userService.currentUser();
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 400 })
  create(@Body() req: CreateUser): User {
    return this.userService.create(req);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() req: UserLogin): Token {
    return this.userService.generateToken(req);
  }

  @Post('renew_token')
  @HttpCode(200)
  @ApiResponse({ status: 404 })
  refreshToken(@Query('refreshToken') refreshToken: string): Token {
    return this.userService.renewToken(refreshToken);
  }
}
