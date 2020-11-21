import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(data);
    const userSaved = this.userRepository.save(user);
    await getConnection().queryResultCache.remove(['listUsers']);
    return userSaved;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({where: { email }});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find({cache: { id: 'listUsers', milliseconds: 15000 }});
  }

  async updateUser(data: UpdateUserInput, loggedUser: User): Promise<User> {
    if(loggedUser.id === data.id){
      const user = await this.getUserById(data.id);
      return this.userRepository.save({ ...user, ...data });
    } else {
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: string, loggedUser: User): Promise<void> {
    if(loggedUser.id === id){
    const user = await this.getUserById(id);
    const userDeleted = await this.userRepository.delete(user);
    if (!userDeleted) {
      throw new InternalServerErrorException();
    }
  } else {
    throw new InternalServerErrorException();
  }
  }
}
