import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
