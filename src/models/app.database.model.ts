import { Expose } from 'class-transformer';

export abstract class DatabaseModel<T> {
  @Expose()
  /**
   * Entity ID
   */
  id?: string;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
