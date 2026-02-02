import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { Routine } from './entities/routine.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
  ) {}

  create(createRoutineDto: CreateRoutineDto, user: User) {
    const routine = this.routinesRepository.create({
      ...createRoutineDto,
      user,
    });
    return this.routinesRepository.save(routine);
  }

  findAll(user: User) {
    return this.routinesRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: string, user: User) {
    const routine = await this.routinesRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!routine) {
      throw new NotFoundException(`Routine #${id} not found`);
    }
    return routine;
  }

  async update(id: string, updateRoutineDto: UpdateRoutineDto, user: User) {
    const routine = await this.findOne(id, user);
    this.routinesRepository.merge(routine, updateRoutineDto);
    return this.routinesRepository.save(routine);
  }

  async remove(id: string, user: User) {
    const routine = await this.findOne(id, user);
    return this.routinesRepository.remove(routine);
  }
}
