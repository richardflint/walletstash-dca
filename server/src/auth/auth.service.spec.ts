import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { User } from '../users/user.entity';

const user = {
  id: 1,
  username: 'test',
  password: '$2b$10$SI18tR9MCRpaZwZ.9/2etOeeeQaUsZVreYpwpW5ITQ3wvrURmS70q',
  isActive: true,
} as User;

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        UsersService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest
              .fn()
              .mockImplementation((username: string) => Promise.resolve(user)),
            create: jest
              .fn()
              .mockImplementation((user: RegisterUserDto) =>
                Promise.resolve({ id: '1', ...user }),
              ),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('validateUser', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        UsersService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest
              .fn()
              .mockImplementation((username: string) => Promise.resolve(user)),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  test('should return a user object when credentials are valid', async () => {
    const user = await service.validateUser('test', 'changeme');
    expect(user).toEqual({ id: 1, username: 'test', isActive: true });
  });

  test('should return null when credentials are invalid', async () => {
    const res = await service.validateUser('xxx', 'xxx');
    expect(res).toBeNull();
  });
});

describe('validateLogin', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        UsersService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest
              .fn()
              .mockImplementation((username: string) => Promise.resolve(user)),
            create: jest
              .fn()
              .mockImplementation((user: RegisterUserDto) =>
                Promise.resolve({ id: '1', ...user }),
              ),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  test('should return JWT object when credentials are valid', async () => {
    const res = await service.login({ username: 'maria', userId: 3 });
    expect(res.access_token).toBeDefined();
  });
});
