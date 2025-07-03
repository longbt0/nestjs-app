# Validation Guide

## Overview
Hệ thống validation của ứng dụng bao gồm nhiều lớp để đảm bảo dữ liệu đầu vào hợp lệ và an toàn.

## Validation Layers

### 1. Global ValidationPipe
```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // Remove unknown properties
  forbidNonWhitelisted: true, // Throw error for unknown properties
  transform: true,           // Auto-transform types
}));
```

### 2. Custom Pipes

#### ParsePositiveIntPipe
- Validates that parameters are positive integers
- Used for ID parameters
```typescript
@Get(':id')
findOne(@Param('id', ParsePositiveIntPipe) id: number) {
  return this.service.findOne(id);
}
```

#### TrimPipe
- Automatically trims whitespace from string inputs
- Applied at controller level
- Excludes password field from trimming

### 3. Custom Validators

#### IsStrongPassword
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

Usage:
```typescript
@IsStrongPassword({ message: 'Password must be strong' })
password: string;
```

#### IsVietnamesePhoneNumber
- Validates Vietnamese phone number format
- Supports both domestic (0x) and international (84x) formats

Usage:
```typescript
@IsVietnamesePhoneNumber({ message: 'Invalid phone number' })
phone?: string;
```

### 4. Data Transformation Decorators

#### SanitizeHtml
- Removes HTML tags and potentially harmful content
- Removes script tags
- Removes JavaScript protocols
- Removes event handlers

#### Capitalize
- Capitalizes first letter and lowercases the rest

#### ToLowerCase
- Converts string to lowercase

## DTO Validation Examples

### User DTO
```typescript
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
```

### Product DTO
```typescript
export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  @SanitizeHtml()
  @Capitalize()
  name: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with max 2 decimal places' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Max(999999.99, { message: 'Price must be less than 1,000,000' })
  @Type(() => Number)
  price: number;
}
```

## Testing Validation

### Valid Requests

#### Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPass123!",
    "phone": "0912345678"
  }'
```

#### Create Product
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50
  }'
```

### Invalid Requests (Will Return Validation Errors)

#### Weak Password
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }'
```

Response:
```json
{
  "message": [
    "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

#### Invalid Phone Number
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPass123!",
    "phone": "invalid-phone"
  }'
```

#### Invalid ID Parameter
```bash
curl http://localhost:3000/users/-1
```

Response:
```json
{
  "message": "id must be a positive number",
  "error": "Bad Request",
  "statusCode": 400
}
```

#### HTML in Input (Will be Sanitized)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"hack\")</script>John Doe",
    "email": "john@example.com",
    "password": "StrongPass123!"
  }'
```

The script tag will be removed, and name will be "John Doe".

## Error Response Format

```json
{
  "message": [
    "Validation error message 1",
    "Validation error message 2"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Validation Rules Summary

### User Validation
- **Name**: Required, string, min 2 chars, sanitized, capitalized
- **Email**: Required, valid email format, lowercase
- **Password**: Required, strong password (8+ chars, mixed case, numbers, special chars)
- **Phone**: Optional, Vietnamese phone format
- **Address**: Optional, sanitized

### Product Validation
- **Name**: Required, string, sanitized, capitalized
- **Description**: Required, string, sanitized
- **Price**: Required, number, 0-999999.99, max 2 decimal places
- **Category**: Optional, string, sanitized, capitalized
- **Stock**: Optional, number, 0-999999

### ID Parameters
- Must be positive integers
- Automatically validated by ParsePositiveIntPipe

## Security Features

1. **HTML Sanitization**: Removes potentially dangerous HTML/JS
2. **Input Trimming**: Removes unnecessary whitespace
3. **Type Transformation**: Ensures correct data types
4. **Whitelist Validation**: Rejects unknown properties
5. **Strong Password Enforcement**: Prevents weak passwords
6. **Input Length Limits**: Prevents extremely long inputs

## Custom Validation Implementation

### Creating Custom Validator
```typescript
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCustomValidation(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCustomValidation',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Your validation logic here
          return true; // or false
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} failed custom validation`;
        },
      },
    });
  };
}
```

### Creating Custom Transform
```typescript
import { Transform } from 'class-transformer';

export function CustomTransform() {
  return Transform(({ value }) => {
    // Your transformation logic here
    return transformedValue;
  });
}
``` 