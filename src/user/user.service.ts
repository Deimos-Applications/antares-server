import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  // TODO: Create DTOs
  async create(payload: Partial<User>) {
    const user = await this.repo.findOne({ where: { email: payload.email } });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.repo.create(payload);
    await this.repo.save(newUser);

    return newUser;
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findByLogin(email: string, password: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
