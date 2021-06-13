import { Todo } from 'src/models/app.todo.model';
import { TodoRepository } from 'src/repositories/app.todo.repository';
import { DateTime } from 'luxon';
import { CurrentUserProvider } from './app.current-user-provider.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateTodo } from 'src/dtos/app.todo.create.dto';
import { UpdateTodo } from 'src/dtos/app.todo.update.dto';
import { EntityNotFoundError } from 'src/infra/errors/app.entity-not-found.error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly currentUserProvider: CurrentUserProvider,
  ) {}

  findById(id: string): Todo {
    const todo = this.todoRepository.findById(id);
    if (todo.userId !== this.currentUserProvider.id()) {
      throw new EntityNotFoundError('todo not found');
    }
    return todo;
  }

  findByUserId(userId: string): Todo[] {
    return this.todoRepository.findByUserId(userId);
  }

  create(model: CreateTodo): Todo {
    const todo = new Todo({
      ...model,
      id: uuidv4(),
      userId: this.currentUserProvider.id(),
      updated: DateTime.utc().toMillis(),
    });
    return this.todoRepository.create(todo);
  }

  update(id: string, model: UpdateTodo): Todo {
    let todo = this.findById(id);
    todo = {
      ...todo,
      ...model,
      updated: DateTime.utc().toMillis(),
    };
    return this.todoRepository.update(todo);
  }

  delete(id: string): boolean {
    const todo = this.findById(id);
    return this.todoRepository.delete(todo.id);
  }

  all(): Todo[] {
    try {
      return this.todoRepository.filter(
        'userId',
        this.currentUserProvider.id(),
      );
    } catch {
      return [];
    }
  }
}
