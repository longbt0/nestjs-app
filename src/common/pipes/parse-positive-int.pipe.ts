import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    
    if (isNaN(val)) {
      throw new BadRequestException(`${metadata.data} must be a number`);
    }
    
    if (val <= 0) {
      throw new BadRequestException(`${metadata.data} must be a positive number`);
    }
    
    return val;
  }
} 