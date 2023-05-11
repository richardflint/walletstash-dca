import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeConfigurationRequest } from './dto/exchange-configuration-request';
import { ExchangeConfiguration } from './exchange-configuration.entity';
import { ExchangeConfigurationsController } from './exchange-configurations.controller';
import { ExchangeConfigurationsService } from './exchange-configurations.service';

const exchangeConfiguration1 = {
  id: 1,
};
const exchangeConfigurations: ExchangeConfiguration[] = [
  exchangeConfiguration1,
  {
    id: 2,
  },
] as ExchangeConfiguration[];

const exchangeConfiguration: ExchangeConfiguration = {
  id: 1,
} as ExchangeConfiguration;

describe('ExchangeConfigurationsController', () => {
  let controller: ExchangeConfigurationsController;
  let service: ExchangeConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeConfigurationsController],
      providers: [
        ExchangeConfigurationsService,
        {
          provide: ExchangeConfigurationsService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation(
                (configuration: ExchangeConfigurationRequest) =>
                  Promise.resolve({ id: 1, ...configuration }),
              ),
            update: jest
              .fn()
              .mockImplementation(
                (id: number, configuration: ExchangeConfigurationRequest) =>
                  Promise.resolve({ id: 1, ...configuration }),
              ),
            findAll: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(exchangeConfigurations),
              ),
            findOne: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(exchangeConfiguration1),
              ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExchangeConfigurationsController>(
      ExchangeConfigurationsController,
    );

    service = module.get<ExchangeConfigurationsService>(
      ExchangeConfigurationsService,
    );
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    test('should create a configuration', async () => {
      const newExchangeConfiguration: ExchangeConfigurationRequest = {
        name: 'test configuration',
        exchangeKey: '',
        apiUsername: '',
        apiKey: '',
        secretKey: '',
        inputSymbol: '',
        outputSymbol: '',
        tradingPair: '',
        withdrawalSymbol: '',
        withdrawalAddress: '',
        withdrawalTag: '',
        customTradingParams: '',
        customWithdrawParams: '',
      } as ExchangeConfigurationRequest;

      expect(await controller.create(newExchangeConfiguration)).toEqual({
        id: 1,
        ...newExchangeConfiguration,
      });
    });
  });

  describe('findAll', () => {
    test('should return all configurations', async () => {
      expect(await controller.findAll()).toEqual(exchangeConfigurations);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    test('should return a configurations', async () => {
      expect(await controller.findOne(1)).toEqual(exchangeConfiguration1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    test('should update configurations', async () => {
      const updatedExchangeConfiguration: ExchangeConfigurationRequest = {
        name: 'updated',
      } as ExchangeConfigurationRequest;

      expect(await controller.update(1, updatedExchangeConfiguration)).toEqual({
        id: 1,
        ...updatedExchangeConfiguration,
      });
      expect(service.update).toHaveBeenCalledWith(
        1,
        updatedExchangeConfiguration,
      );
    });
  });

  describe('remove', () => {
    test('should delete configurations', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
