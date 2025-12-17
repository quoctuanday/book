import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[^<>]*$/, {
    message: 'Name must not contain HTML or script tags',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  avatarUrl?: string;
}
