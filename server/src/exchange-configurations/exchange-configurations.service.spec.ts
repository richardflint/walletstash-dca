import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeConfigurationsService } from './exchange-configurations.service';
import { Repository } from 'typeorm';
import { ExchangeConfiguration } from './exchange-configuration.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeMarket } from '../exchanges/exchange-market.entity';
import { Conversion } from './conversion.entity';

const configurations = [];
const configuration = {};
const conversion = {};

describe('ExchangeConfigurationsService', () => {
  let service: ExchangeConfigurationsService;
  let exchangeConfigurationRepository: Repository<ExchangeConfiguration>;
  let conversionRepository: Repository<Conversion>;

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
        {
          provide: getRepositoryToken(Conversion),
          useValue: {
            save: jest.fn().mockResolvedValue(conversion),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangeConfigurationsService>(
      ExchangeConfigurationsService,
    );
    exchangeConfigurationRepository = module.get<
      Repository<ExchangeConfiguration>
    >(getRepositoryToken(ExchangeConfiguration));
    conversionRepository = module.get<Repository<Conversion>>(
      getRepositoryToken(Conversion),
    );
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    test('returns null when configuration can not be found', async () => {
      exchangeConfigurationRepository.findOneBy = jest
        .fn()
        .mockResolvedValue(null);

      const configuration = await service.update(1, null);
      expect(configuration).toBeNull();
    });
  });

  describe('delete', () => {
    test('returns null when configuration can not be found', async () => {
      exchangeConfigurationRepository.findOneBy = jest
        .fn()
        .mockResolvedValue(null);

      const configuration = await service.remove(1);
      expect(configuration).toBeNull();
    });
  });

  describe('addConversion', () => {
    test('does not save conversion when configuration can not be found', async () => {
      exchangeConfigurationRepository.findOneBy = jest
        .fn()
        .mockResolvedValue(null);

      await service.addConversion(1, new Date(), '1-2-3-4-5', 'BTC', 1);
      expect(exchangeConfigurationRepository.save).not.toBeCalled();
    });

    test('save conversion when configuration found', async () => {
      const configuration = { id: 1, name: 'test' } as ExchangeConfiguration;
      exchangeConfigurationRepository.findOneBy = jest
        .fn()
        .mockResolvedValue(configuration);

      await service.addConversion(1, new Date(), '1-2-3-4-5', 'BTC', 1);
      const expectedConfiguration = {
        id: 1,
        name: 'test',
        conversions: [],
      } as ExchangeConfiguration;

      const conversion = {
        datetime: new Date(),
        externalId: '1-2-3-4-5',
        symbol: 'BTC',
        amount: 1,
        configuration: expectedConfiguration,
      } as Conversion;

      expectedConfiguration.conversions = [conversion];

      expect(exchangeConfigurationRepository.save).toBeCalledWith(
        expectedConfiguration,
      );
      expect(conversionRepository.save).toBeCalledWith(conversion);
    });
  });
});
