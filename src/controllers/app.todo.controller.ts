import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateTodo } from 'src/dtos/app.todo.create.dto';
import { UpdateTodo } from 'src/dtos/app.todo.update.dto';
import { AuthInterceptor } from 'src/infra/http/app.auth.interceptor';
import { Todo } from 'src/models/app.todo.model';
import { TodoService } from 'src/services/app.todo.service';

@ApiBearerAuth('token')
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Delete(':id')
  @HttpCode(204)
  @HttpCode(404)
  delete(@Param('id') id: string): void {
    this.todoService.delete(id);
  }

  @Get(':id')
  @HttpCode(200)
  @HttpCode(404)
  get(@Param('id') id: string): Todo {
    return this.todoService.findById(id);
  }

  @Post()
  @HttpCode(201)
  @HttpCode(400)
  create(@Body() req: CreateTodo): Todo {
    return this.todoService.create(req);
  }

  @Put(':id')
  @HttpCode(200)
  @HttpCode(400)
  @HttpCode(404)
  update(@Param('id') id: string, @Body() req: UpdateTodo): Todo {
    return this.todoService.update(id, req);
  }

  @Get()
  @HttpCode(200)
  all(): Todo[] {
    return this.todoService.all();
  }
}
