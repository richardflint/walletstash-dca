import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeConfigurationsService } from './exchange-configurations.service';
import { Repository } from 'typeorm';
import { ExchangeConfiguration } from './exchange-configuration.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const configurations = [];
const configuration = {};

describe('ExchangeConfigurationsService', () => {
  let service: ExchangeConfigurationsService;
  let repository: Repository<ExchangeConfiguration>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeConfigurationsService,
        {
          provide: getRepositoryToken(ExchangeConfiguration),
          useValue: {
            find: jest.fn().mockResolvedValue(configurations),
            findOneBy: jest.fn().mockResolvedValue(configuration),
            save: jest.fn().mockResolvedValue(configuration),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangeConfigurationsService>(
      ExchangeConfigurationsService,
    );
    repository = module.get<Repository<ExchangeConfiguration>>(
      getRepositoryToken(ExchangeConfiguration),
    );
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});
