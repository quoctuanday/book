import { IsString } from 'class-validator';

export class UpsertChapterContentDto {
  @IsString()
  content: string;
}
