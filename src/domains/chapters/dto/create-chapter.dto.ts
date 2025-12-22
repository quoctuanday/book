import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  bookId: string;

  @IsInt()
  @Min(1)
  number: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  content: string;
}
