import { IsPhoneNumber, IsString, IsIn, IsOptional } from 'class-validator';

export class OtpSmsDto {
  @IsPhoneNumber()
  to: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsIn(['generic', 'login', 'registration', 'password_reset'])
  purpose?: 'generic' | 'login' | 'registration' | 'password_reset';

  @IsOptional()
  @IsString()
  language?: string;
}
