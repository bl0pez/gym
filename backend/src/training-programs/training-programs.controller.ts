import { Controller, Post, Body, Param } from '@nestjs/common';
import { TrainingProgramsService } from './training-programs.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/enums';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { Payload } from '../interfaces';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';

@Controller('training-programs')
export class TrainingProgramsController {
  constructor(
    private readonly trainingProgramsService: TrainingProgramsService,
  ) {}

  @Post()
  @Auth(Role.PROFESSOR)
  create(
    @AuthUser() user: Payload,
    @Body() createDto: CreateTrainingProgramDto,
  ) {
    return this.trainingProgramsService.createProgram(user.id, createDto);
  }

  @Post(':id/assign/:userId')
  @Auth(Role.PROFESSOR)
  assign(@Param('id') id: string, @Param('userId') userId: string) {
    return this.trainingProgramsService.assignToUser(id, userId);
  }

  @Post(':id/clone')
  @Auth(Role.USER)
  clone(@AuthUser() user: Payload, @Param('id') id: string) {
    return this.trainingProgramsService.cloneProgramForUser(id, user.id);
  }
}
