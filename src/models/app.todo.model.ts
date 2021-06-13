import { Expose } from 'class-transformer';
import { DatabaseModel } from './app.database.model';

export class Todo extends DatabaseModel<Todo> {
  @Expose()
  /**
   * Todo title
   */
  title: string;

  @Expose()
  /**
   * Todo body
   */
  body: string;

  @Expose()
  /**
   * Date updated
   */
  updated: number;

  @Expose()
  /**
   * ID of the owner
   */
  userId: string;
}
