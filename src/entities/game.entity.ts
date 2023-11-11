import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,JoinTable,JoinColumn } from 'typeorm';
import { User } from './User.entity';

export enum Status {
  Ongoing = 'Ongoing',
  Lost = 'Lost',
  Won = 'Won',
}

// console.log(User)

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  secretWord: string;

  @Column({
    default: 5,
  })
  chances: number;

  @Column({ default: '' })
  guessletters: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: null })
  finishedAt: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Ongoing,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.games)
   user: User;
}
