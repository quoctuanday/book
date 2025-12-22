import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListChaptersQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;
}
