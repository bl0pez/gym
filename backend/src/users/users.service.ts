import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;

    const data: Prisma.UserUpdateInput = { ...rest };

    if (password) {
      const bcrypt = await import('bcrypt');
      data.password = bcrypt.hashSync(password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch {
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }
}
