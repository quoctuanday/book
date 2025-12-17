import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @MaxLength(1000)
  coverImage?: string;
}
