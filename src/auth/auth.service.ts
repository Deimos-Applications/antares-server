import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './auth.dto';
import { omit } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async validateUser(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        await this.i18n.t('auth.USER_NOT_FOUND'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return omit(user, ['password']);
  }

  async login(user: User) {
    const payload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(payload: RegisterDto): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);

    if (user) {
      throw new HttpException(
        await this.i18n.t('auth.USER_ALREADY_EXISTS'),
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = await this.userService.create(payload);
    return newUser;
  }
}
