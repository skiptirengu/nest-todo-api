import { Expose } from 'class-transformer';
import { DatabaseModel } from 'src/models/app.database.model';

export class Token extends DatabaseModel<Token> {
  @Expose()
  /**
   * Token owner
   */
  userId: string;

  @Expose()
  /**
   * Time which the token is set to expire (unix timestamp)
   */
  expires: number;

  @Expose()
  /**
   * Refresh token associated with the access token
   */
  refreshToken: string;
}
