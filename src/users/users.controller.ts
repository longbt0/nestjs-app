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
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/auth/roles.decorator';
import { CurrentUser } from '../common/decorators/auth/current-user.decorator';
import { Public } from '../common/decorators/auth/public.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(TrimPipe)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getMyProfile(@CurrentUser() user: User) {
    const { password, ...result } = user;
    return result;
  }

  @Get(':id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number, @CurrentUser() currentUser: User) {
    // Users can view their own profile, admins/moderators can view any profile
    if (currentUser.role === Role.USER && currentUser.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    // Users can only update their own profile, admins can update any profile
    if (currentUser.role === Role.USER && currentUser.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
