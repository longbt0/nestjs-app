import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/auth/roles.decorator';
import { Public } from '../common/decorators/auth/public.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(TrimPipe)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch(':id')
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
