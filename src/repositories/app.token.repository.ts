import { Injectable } from '@nestjs/common';
import { Token } from 'src/models/app.token.model';
import { DatabaseService, Tables } from 'src/services/app.database.service';

@Injectable()
export class TokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findById(id: string): Token {
    return new Token(this.databaseService.find(Tables.auth, id));
  }

  findByUserId(userId: string): Token {
    return new Token(
      this.databaseService.findBy(Tables.auth, 'userId', userId),
    );
  }

  delete(id: string): boolean {
    return this.databaseService.delete(Tables.auth, id);
  }

  create(token: Token): Token {
    return new Token(this.databaseService.insert(Tables.auth, token));
  }

  update(token: Token): Token {
    return new Token(this.databaseService.update(Tables.auth, token));
  }
}
