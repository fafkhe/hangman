import { Expose } from 'class-transformer';

export class singleUserDto {
  @Expose()
  name: string;

  @Expose()
  email: string;
}
