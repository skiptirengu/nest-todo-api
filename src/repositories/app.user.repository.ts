import { Injectable } from '@nestjs/common';
import { User } from 'src/models/app.user.model';
import { DatabaseService, Tables } from 'src/services/app.database.service';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findById(id: string): User {
    return new User(this.databaseService.find(Tables.user, id));
  }
  findByUsername(username: string): User {
    return new User(
      this.databaseService.findBy(Tables.user, 'username', username),
    );
  }

  create(model: User): User {
    return new User(this.databaseService.insert(Tables.user, model));
  }

  usernameExists(username: string): boolean {
    return this.databaseService.exists(Tables.user, 'username', username);
  }
}
