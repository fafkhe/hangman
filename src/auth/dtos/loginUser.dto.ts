import { IsString } from '@nestjs/class-validator';

export class loginUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}