import { createHash, randomBytes } from 'crypto';
import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { User } from 'src/models/app.user.model';
import { Token } from 'src/models/app.token.model';
import { DuplicatedEntityError } from '../infra/errors/app.duplicated-entity.error';
import { AuthError } from 'src/infra/errors/app.auth.error';
import { CreateUser } from 'src/dtos/app.user.create.dto';
import { CurrentUserProvider } from 'src/services/app.current-user-provider.service';
import { UserRepository } from 'src/repositories/app.user.repository';
import { TokenRepository } from 'src/repositories/app.token.repository';
import { UserLogin } from 'src/dtos/app.user.login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly currentUserProvider: CurrentUserProvider,
  ) {}

  /**
   * @param {string} tokenId
   * @returns {string} The user ID associated with this token
   */
  verifyToken(tokenId: string): string {
    if (!tokenId) {
      throw new AuthError('token is invalid');
    }

    let token: Token;

    try {
      token = this.tokenRepository.findById(tokenId);
    } catch (error) {
      throw new AuthError('token is invalid');
    }

    if (DateTime.utc().toMillis() > token.expires) {
      this.tokenRepository.delete(token.id);
      throw new AuthError('token is expired');
    }

    return token.userId;
  }

  generateToken(loginDetails: UserLogin): Token {
    const user = this.userRepository.findByUsername(loginDetails.username);

    if (user.password !== this.hashPassword(loginDetails.password)) {
      throw new AuthError('invalid credentials');
    }

    let token: Token;
    let exist = false;

    try {
      token = this.tokenRepository.findByUserId(user.id);
      token = this.createToken(user.id, token.id);
      exist = true;
    } catch (error) {
      token = this.createToken(user.id);
      exist = false;
    }

    return exist
      ? this.tokenRepository.update(token)
      : this.tokenRepository.create(token);
  }

  create(model: CreateUser): User {
    if (this.userRepository.usernameExists(model.username)) {
      throw new DuplicatedEntityError('username already taken');
    }

    const user: User = new User({
      id: uuidv4(),
      username: model.username,
      password: this.hashPassword(model.password),
    });

    return this.userRepository.create(user);
  }

  currentUser(): User {
    return this.userRepository.findById(this.currentUserProvider.id());
  }

  private createToken(userId: string, id: string = null): Token {
    return new Token({
      id: id ?? randomBytes(64).toString('hex'),
      expires: DateTime.utc().plus({ minutes: 30 }).toMillis(),
      userId,
    });
  }

  private hashPassword(password: string) {
    return createHash('md5').update(password).digest('hex');
  }
}
