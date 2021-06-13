import { Exclude, Expose } from 'class-transformer';
import { DatabaseModel } from 'src/models/app.database.model';

export class User extends DatabaseModel<User> {
  @Expose()
  /**
   * Username
   */
  username: string;

  @Exclude()
  password?: string;
}
