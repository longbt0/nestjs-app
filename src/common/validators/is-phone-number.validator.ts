import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsVietnamesePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVietnamesePhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // Vietnamese phone number patterns
          const phoneRegex = /^(84|0[3|5|7|8|9])+([0-9]{8,9})$/;
          return phoneRegex.test(value.replace(/\s+/g, ''));
        },
        defaultMessage(args: ValidationArguments) {
          return 'Phone number must be a valid Vietnamese phone number (e.g., 0912345678, 84912345678)';
        },
      },
    });
  };
} 