import { Injectable } from '@nestjs/common';
import { Tables } from 'src/constants/app.database.constants';
import { Todo } from 'src/models/app.todo.model';
import { DatabaseService } from 'src/services/app.database.service';

@Injectable()
export class TodoRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findById(id: string): Todo {
    return new Todo(this.databaseService.find(Tables.todo, id));
  }

  findByUserId(userId: string): Todo[] {
    return this.databaseService
      .filter(Tables.todo, 'userId', userId)
      .map((data) => new Todo(data));
  }

  create(todo: Todo): Todo {
    return new Todo(this.databaseService.insert(Tables.todo, todo));
  }

  update(todo: Todo): Todo {
    return new Todo(this.databaseService.update(Tables.todo, todo));
  }

  delete(id: string): boolean {
    return this.databaseService.delete(Tables.todo, id);
  }

  filter(key: string, value: any): Todo[] {
    return this.databaseService
      .filter(Tables.todo, key, value)
      .map((data) => new Todo(data));
  }
}
