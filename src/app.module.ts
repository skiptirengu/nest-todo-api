import { Logger, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/controllers/app.controller';
import { DatabaseService } from 'src/services/app.database.service';
import { CurrentUserProvider } from 'src/services/app.current-user-provider.service';
import { TodoController } from 'src/controllers/app.todo.controller';
import { UserController } from 'src/controllers/app.user.controller';
import { UserService } from 'src/services/app.user.service';
import { TodoService } from 'src/services/app.todo.service';
import { TodoRepository } from './repositories/app.todo.repository';
import { TokenRepository } from './repositories/app.token.repository';
import { UserRepository } from './repositories/app.user.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, TodoController, UserController],
  providers: [
    CurrentUserProvider,
    DatabaseService,
    TodoService,
    UserService,
    TodoRepository,
    TokenRepository,
    UserRepository,
    Logger,
  ],
})
export class AppModule implements NestModule {
  configure() {
    //
  }
}
