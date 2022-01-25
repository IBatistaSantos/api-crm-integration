import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/details')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user._id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  infoUser(@GetUser() user: User) {
    return this.usersService.findOne(user._id);
  }

  @Patch(':id/disable')
  disableUser(@Param('id') id: string) {
    return this.usersService.disableUser(id);
  }

  @Patch(':id/active')
  activeUser(@Param('id') id: string) {
    return this.usersService.activeUser(id);
  }
}
