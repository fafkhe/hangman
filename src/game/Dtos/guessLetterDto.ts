import { IsString, IsNumber,  } from "class-validator";


export class GuessLetterDto{
  @IsString()
  guessletter: string;

  @IsNumber()
  gameId: number;

  

}