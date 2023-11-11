import { Expose } from 'class-transformer';
import { Transform, Type } from 'class-transformer';
import { User } from 'src/entities/User.entity';
import { ValidateNested } from 'class-validator';
import { UserDto } from 'src/auth/dtos/userDto';

export enum Status {
  Ongoing = 'Ongoing',
  Lost = 'Lost',
  Won = 'Won',
}

export class singleGameDto {
  @Expose()
  id: number;

  @Expose()
  @Transform((obj) => {
    const guesslettersArr = obj.obj.guessletters.split('');

    return obj.obj.secretWord
      .split('')
      .map((x) => {
        const exist = guesslettersArr.includes(x);
        return exist ? x : '-';
      })
      .join('');
  })
  secretWord: string;

  @Expose()
  userId: number;

  @Expose()
  chances: number;

  @Transform((obj) => {
    const secretWordArr = obj.obj.secretWord.split('');
    return obj.obj.guessletters.split('').map((x) => {
      const exist = secretWordArr.includes(x);
      return {
        char: x,
        contain: exist,
      };
    });
  })
  @Expose()
  guessletters: object[];

  @Expose()
  createdAt: Date;

  @Expose()
  finishedAt: string;

  @Expose()
  status: Status;

  @Expose()
  @Type(() => UserDto)
  @ValidateNested()
  readonly user: User;
  
}
