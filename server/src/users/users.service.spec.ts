import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';

const user = {
  username: 'test',
  password: '$2b$10$SI18tR9MCRpaZwZ.9/2etOeeeQaUsZVreYpwpW5ITQ3wvrURmS70q',
  isActive: true,
} as User;

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(user),
            save: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    repository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  test('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('throws error when passwords do not match', async () => {
      const registerUserDto = {
        username: 'test',
        password: 'password',
        repeatedPassword: 'mismatch',
      } as RegisterUserDto;

      await expect(service.create(registerUserDto)).rejects.toThrowError(
        'Passwords dont match',
      );
    });

    test('saves new user with a hashed password', async () => {
      const registerUserDto = {
        username: 'test',
        password: 'changeme',
        repeatedPassword: 'changeme',
      } as RegisterUserDto;

      const savedUser = await service.create(registerUserDto);
      expect(savedUser).toEqual(user);
    });
  });
});
