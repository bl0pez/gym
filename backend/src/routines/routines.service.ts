import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoutineDto, RoutineSetDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { Payload } from 'src/interfaces';
import { JsonValue } from '@prisma/client/runtime/client';

@Injectable()
export class RoutinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoutineDto: CreateRoutineDto, user: Payload) {
    return this.prisma.routine.create({
      data: {
        ...createRoutineDto,
        userId: user.id,
        sets: JSON.stringify(createRoutineDto.sets),
      },
    });
  }

  async findAll(user: Payload) {
    const routines = await this.prisma.routine.findMany({
      where: { userId: user.id },
    });
    return routines.map((routine) => ({
      ...routine,
      sets: this.parseSets(routine.sets),
    }));
  }

  async findOne(id: string, user: Payload) {
    const routine = await this.prisma.routine.findUnique({
      where: { id, userId: user.id },
    });
    if (!routine) {
      throw new NotFoundException(`Routine #${id} not found`);
    }
    return routine;
  }

  async update(id: string, updateRoutineDto: UpdateRoutineDto, user: Payload) {
    await this.findOne(id, user);
    // return this.prisma.routine.update({
    //   where: { id },
    //   data: updateRoutineDto,
    // });
  }

  async remove(id: string, user: Payload) {
    const routine = await this.findOne(id, user);
    return this.prisma.routine.delete({
      where: { id: routine.id },
    });
  }

  private parseSets(sets: JsonValue | null): RoutineSetDto[] {
    if (!sets) return [];
    return JSON.parse(sets as string) as RoutineSetDto[];
  }
}
