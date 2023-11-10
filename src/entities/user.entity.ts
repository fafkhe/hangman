import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
const BCRYPT_HASH_ROUND = 8;

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: '',
  })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, BCRYPT_HASH_ROUND);
  }
}
