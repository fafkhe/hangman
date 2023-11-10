import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  Ongoing = 'Ongoing',
  Lost = 'Lost',
  Won = 'Won',
}

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

  @Column({ default: "" })
  guessletters: string

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
}
