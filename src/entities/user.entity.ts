import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  JoinTable
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Game } from './game.entity';
const BCRYPT_HASH_ROUND = 8;


console.log(Game)

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
  
  @OneToMany(() => Game, (game) => game.user)
  games: Game[];

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, BCRYPT_HASH_ROUND);
  }

}
