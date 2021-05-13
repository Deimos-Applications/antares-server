import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { hash } from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
