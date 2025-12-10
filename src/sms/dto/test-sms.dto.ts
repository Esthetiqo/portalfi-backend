import { IsPhoneNumber, IsString, IsOptional } from 'class-validator';

export class TestSmsDto {
  @IsPhoneNumber()
  to: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  language?: string;
}
