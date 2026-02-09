import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/generated/prisma/enums';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';

@Injectable()
export class TrainingProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProgram(professorId: string, data: CreateTrainingProgramDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: professorId },
    });
    if (!user) throw new NotFoundException('Professor not found');

    if (user.role !== Role.PROFESSOR && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only professors can create programs');
    }

    return await this.prisma.trainingProgram.create({
      data: {
        ...data,
        professorId,
      },
    });
  }

  async assignToUser(programId: string, userId: string) {
    return this.prisma.programAssignment.create({
      data: {
        programId,
        userId,
      },
    });
  }

  async cloneProgramForUser(programId: string, userId: string) {
    const program = await this.prisma.trainingProgram.findUnique({
      where: { id: programId },
      include: { routines: true },
    });

    if (!program) throw new NotFoundException('Program not found');

    const clonedRoutines = await Promise.all(
      program.routines.map((routine) =>
        this.prisma.routine.create({
          data: {
            name: routine.name,
            category: routine.category,
            description: routine.description,
            date: routine.date,
            sets: routine.sets || {},
            observations: routine.observations,
            videoUrls: routine.videoUrls,
            isTemplate: false,
            userId: userId,
            originalRoutineId: routine.id,
            programId: program.id,
          },
        }),
      ),
    );

    return {
      message: 'Program cloned successfully',
      clonedRoutinesCount: clonedRoutines.length,
    };
  }
}
