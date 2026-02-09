import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import type { User } from 'src/generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/generated/prisma/enums';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth('ADMIN' as Role)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth()
  @Patch('profile')
  update(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
