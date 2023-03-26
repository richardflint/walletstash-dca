import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { PasswordMismatchError } from './passwordMismatch.error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  async create(registerUserDto: RegisterUserDto): Promise<User | undefined> {
    if (registerUserDto.password != registerUserDto.repeatedPassword) {
      throw new PasswordMismatchError('Passwords dont match');
    }

    const saltOrRounds = 10;
    const password = registerUserDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user = new User();
    user.username = registerUserDto.username;
    user.password = hash;

    const savedUser = this.userRepository.save(user);
    return Promise.resolve(savedUser);
  }
}
