import { createHash, randomBytes } from 'crypto';
import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
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

    if (this.deleteTokenIfExpired(token)) {
      throw new AuthError('token is expired');
    }

    return token.userId;
  }

  renewToken(refreskToken: string): Token {
    const oldToken = this.tokenRepository.findByRefreshToken(refreskToken);
    this.tokenRepository.delete(oldToken.id);
    const token = this.createToken();
    token.userId = oldToken.userId;
    this.tokenRepository.create(token);
    return token;
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
      exist = !this.deleteTokenIfExpired(token);
      token = this.createToken(exist ? token : null);
    } catch (error) {
      token = this.createToken();
      exist = false;
    }

    token.userId = user.id;

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

  private deleteTokenIfExpired(token: Token): boolean {
    const expired = this.isTokenExpired(token);
    if (expired) this.tokenRepository.delete(token.id);
    return expired;
  }

  private isTokenExpired(token: Token): boolean {
    return DateTime.utc().toMillis() > token.expires;
  }

  private createToken(token?: Token): Token {
    const expires = DateTime.utc()
      .plus({ minutes: this.getTokenExpiration() })
      .toMillis();

    return new Token({
      id: token?.id ?? this.randomToken(),
      refreshToken: token?.refreshToken ?? this.randomToken(),
      expires,
    });
  }

  private randomToken(): string {
    return randomBytes(32).toString('hex');
  }

  private getTokenExpiration(): number {
    return this.configService.get<number>('token.expiration.minutes', 60);
  }

  private hashPassword(password: string) {
    return createHash('md5').update(password).digest('hex');
  }
}
