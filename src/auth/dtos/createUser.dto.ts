import { IsString } from '@nestjs/class-validator';

export class craeteUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
