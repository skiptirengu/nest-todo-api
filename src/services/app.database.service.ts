import { Injectable } from '@nestjs/common';
import { JsonDB } from 'node-json-db';
import { DatabaseModel } from 'src/models/app.database.model';
import { EntityNotFoundError } from '../infra/errors/app.entity-not-found.error';

export enum Tables {
  user = 'user',
  todo = 'todo',
  auth = 'auth',
}

@Injectable()
export class DatabaseService {
  private readonly database: JsonDB = new JsonDB(
    'runtime/database',
    true,
    false,
    '/',
  );

  public update<T extends DatabaseModel<any>>(table: Tables, model: T): T {
    if (typeof model.id !== 'string') {
      throw new EntityNotFoundError('entity not found');
    }
    const index = this.database.getIndex(`/${table}`, model.id, 'id');
    if (index === -1) {
      throw new EntityNotFoundError('entity not found');
    }
    this.database.push(`/${table}[${index}]`, model, true);
    return model;
  }

  public insert<T extends DatabaseModel<any>>(table: Tables, model: T): T {
    this.database.push(`/${table}[]`, model, true);
    return model;
  }

  public exists(table: Tables, name: string, value: any): boolean {
    try {
      return this.database.getIndex(`/${table}`, value, name) >= 0;
    } catch {
      return false;
    }
  }

  public find<T extends DatabaseModel<any>>(table: Tables, id: string): T {
    return this.findBy<T>(table, 'id', id);
  }

  public findBy<T extends DatabaseModel<any>>(
    table: Tables,
    name: string,
    value: any,
  ): T {
    const index = this.database.getIndex(`/${table}`, value, name);
    if (index === -1) {
      throw new EntityNotFoundError('entity not found');
    }
    return this.database.getObject<T>(`/${table}[${index}]`);
  }

  public all<T extends DatabaseModel<any>>(table: Tables): T[] {
    return this.database.getObject<T[]>(`/${table}`);
  }

  public filter<T extends DatabaseModel<any>>(
    table: Tables,
    key: string,
    value: any,
  ): T[] {
    return this.database.filter(`/${table}`, (data) => data[key] === value);
  }

  public delete(table: Tables, id: string): boolean {
    const index = this.database.getIndex(`/${table}`, id, 'id');
    if (index === -1) {
      return false;
    } else {
      this.database.delete(`/${table}[${index}]`);
      return true;
    }
  }
}
