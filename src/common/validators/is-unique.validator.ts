import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // This would typically check against database
          // For now, we'll implement a simple check
          return typeof value === 'string' && value.length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be unique`;
        },
      },
    });
  };
} 