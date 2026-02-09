import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import type { Payload } from 'src/interfaces';

@Auth()
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  create(
    @Body() createRoutineDto: CreateRoutineDto,
    @AuthUser() user: Payload,
  ) {
    return this.routinesService.create(createRoutineDto, user);
  }

  @Get()
  findAll(@AuthUser() user: Payload) {
    return this.routinesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() user: Payload) {
    return this.routinesService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @AuthUser() user: Payload,
  ) {
    return this.routinesService.update(id, updateRoutineDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: Payload) {
    return this.routinesService.remove(id, user);
  }
}
