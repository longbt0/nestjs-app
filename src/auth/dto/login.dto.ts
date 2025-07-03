import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from '../../common/decorators/sanitize.decorator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @ToLowerCase()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
} 