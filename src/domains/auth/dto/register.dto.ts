import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(24)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,24}$/, {
    message:
      'Password must be 8–24 characters long and include uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsOptional()
  @MaxLength(50)
  name?: string;
}
