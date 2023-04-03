import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UsersService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue((username: string) => null),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
