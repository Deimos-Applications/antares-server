import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.userService.findByLogin(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
