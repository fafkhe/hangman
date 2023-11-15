import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GameQueryDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page: number;

  @Transform(({ value }) => {
    const x = parseInt(value);
    if (x > 50) return 50;

    return x;
  })
      
  @IsOptional()
  limit: number;
}
