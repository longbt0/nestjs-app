import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SanitizeHtml, Capitalize } from '../../common/decorators/sanitize.decorator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  @SanitizeHtml()
  @Capitalize()
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @SanitizeHtml()
  description: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with max 2 decimal places' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Max(999999.99, { message: 'Price must be less than 1,000,000' })
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @SanitizeHtml()
  @Capitalize()
  category?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  @Max(999999, { message: 'Stock must be less than 1,000,000' })
  @Type(() => Number)
  stock?: number;
}
