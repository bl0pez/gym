import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let password = createUserDto.password;
    if (password) {
      const saltOriginal = await import('bcrypt');
      const salt = await saltOriginal.genSalt();
      password = await saltOriginal.hash(password, salt);
    }
    const user = this.usersRepository.create({ ...createUserDto, password });
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email }, select: ['id', 'email', 'password', 'firstName', 'lastName'] }); 
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) return null;
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }

  async findOrCreate(googleUser: any) {
    let user = await this.usersRepository.findOne({ where: { email: googleUser.email } });
    if (!user) {
      user = this.usersRepository.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        avatarUrl: googleUser.picture,
        googleId: googleUser.googleId,
      });
      await this.usersRepository.save(user);
    } else if (!user.googleId) {
      user.googleId = googleUser.googleId;
      user.avatarUrl = googleUser.picture; // Optional: update avatar
      await this.usersRepository.save(user);
    }
    return user;
  }
}
