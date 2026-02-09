import { Module } from '@nestjs/common';
import { TrainingProgramsService } from './training-programs.service';
import { TrainingProgramsController } from './training-programs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrainingProgramsController],
  providers: [TrainingProgramsService],
  exports: [TrainingProgramsService],
})
export class TrainingProgramsModule {}
