import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsStrongPassword } from '../../common/validators/is-strong-password.validator';
import { IsVietnamesePhoneNumber } from '../../common/validators/is-phone-number.validator';
import { SanitizeHtml, Capitalize, ToLowerCase } from '../../common/decorators/sanitize.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @SanitizeHtml()
  @Capitalize()
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @ToLowerCase()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword({ message: 'Password must be strong' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @IsVietnamesePhoneNumber({ message: 'Please provide a valid Vietnamese phone number' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @SanitizeHtml()
  address?: string;
}
