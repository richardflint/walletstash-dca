import { Exchange } from './exchange';
import { DcaService } from './dca.service';
import { ExchangeConfigurationsService } from '../exchange-configurations/exchange-configurations.service';
import ExchangeFactory from './exchangeFactory';
import { createMock } from '@golevelup/ts-jest';
import { Conversion } from './conversion';
import { ExchangeConfiguration } from '../exchange-configurations/exchange-configuration.entity';

describe('DcaService', () => {
  let service: DcaService;
  let exchangeConfigurationsService: ExchangeConfigurationsService;

  beforeEach(async () => {
    exchangeConfigurationsService = new ExchangeConfigurationsService(null);
    service = new DcaService(exchangeConfigurationsService);
  });

  test('should be defined', async () => {
    expect(service).toBeDefined();
  });

  test('should not perform conversion when currency is zero', async () => {
    const configuration = {
      id: 1,
      apiKey: 'apiKey',
      exchangeKey: 'testKey',
      secretKey: 'secretKey',
      inputSymbol: 'GBP',
      customTradingParams: '{}',
      outputSymbol: 'BTC',
      tradingPair: 'BTC/GBP',
    } as ExchangeConfiguration;

    const result: Promise<ExchangeConfiguration[]> = Promise.resolve([
      configuration,
    ]);
    jest
      .spyOn(exchangeConfigurationsService, 'findAll')
      .mockImplementation(() => result);

    const mockExchange = createMock<Exchange>({
      fetchBalance: (symbol: string) => Promise.resolve(0),
    });

    jest
      .spyOn(ExchangeFactory, 'create')
      .mockImplementation(() => mockExchange);

    await service.performDca();

    expect(mockExchange.performConversion).not.toHaveBeenCalled();
  });

  test('should perform conversion when currency is above zero', async () => {
    const configuration = {
      id: 1,
      apiKey: 'apiKey',
      exchangeKey: 'testKey',
      secretKey: 'secretKey',
      inputSymbol: 'GBP',
      customTradingParams: '{}',
      outputSymbol: 'BTC',
      tradingPair: 'BTC/GBP',
      tradingThreshold: 0,
    } as ExchangeConfiguration;

    const result: Promise<ExchangeConfiguration[]> = Promise.resolve([
      configuration,
    ]);
    jest
      .spyOn(exchangeConfigurationsService, 'findAll')
      .mockImplementation(() => result);

    const conversion = {
      id: 'testId',
      symbol: 'GBP',
      amount: 15.5,
    } as Conversion;

    const mockExchange = createMock<Exchange>({
      fetchBalance: (symbol: string) => Promise.resolve(1),
      performConversion: () => Promise.resolve(conversion),
    });

    jest
      .spyOn(ExchangeFactory, 'create')
      .mockImplementation(() => mockExchange);

    await service.performDca();

    expect(mockExchange.performConversion).toHaveBeenCalled();
  });

  test('should not withdraw when existing pending withdrawal', async () => {
    const configuration = {
      id: 1,
      apiKey: 'apiKey',
      exchangeKey: 'testKey',
      secretKey: 'secretKey',
      inputSymbol: 'GBP',
      customTradingParams: '{}',
      outputSymbol: 'BTC',
      tradingPair: 'BTC/GBP',
    } as ExchangeConfiguration;

    const result: Promise<ExchangeConfiguration[]> = Promise.resolve([
      configuration,
    ]);
    jest
      .spyOn(exchangeConfigurationsService, 'findAll')
      .mockImplementation(() => result);

    const mockExchange = createMock<Exchange>({
      fetchBalance: (symbol: string) => {
        return symbol == 'BTC' ? Promise.resolve(1) : null;
      },
      hasPendingWithdrawals: (symbol: string) => {
        return symbol == 'BTC' ? Promise.resolve(true) : null;
      },
    });

    jest
      .spyOn(ExchangeFactory, 'create')
      .mockImplementation(() => mockExchange);

    await service.performDca();

    expect(mockExchange.performWithdrawal).not.toHaveBeenCalled();
  });

  test('should not withdraw when output currency is zero', async () => {
    const configuration = {
      id: 1,
      apiKey: 'apiKey',
      exchangeKey: 'testKey',
      secretKey: 'secretKey',
      inputSymbol: 'GBP',
      customTradingParams: '{}',
      outputSymbol: 'BTC',
      tradingPair: 'BTC/GBP',
    } as ExchangeConfiguration;

    const result: Promise<ExchangeConfiguration[]> = Promise.resolve([
      configuration,
    ]);
    jest
      .spyOn(exchangeConfigurationsService, 'findAll')
      .mockImplementation(() => result);

    const mockExchange = createMock<Exchange>({
      fetchBalance: (symbol: string) => {
        return symbol == 'BTC' ? Promise.resolve(0) : null;
      },
      hasPendingWithdrawals: (symbol: string) => {
        return symbol == 'BTC' ? Promise.resolve(false) : null;
      },
    });

    jest
      .spyOn(ExchangeFactory, 'create')
      .mockImplementation(() => mockExchange);

    await service.performDca();

    expect(mockExchange.performWithdrawal).not.toHaveBeenCalled();
  });

  test('should withdraw when output currency is above zero and has no pending withdrawals', async () => {
    const configuration = {
      id: 1,
      apiKey: 'apiKey',
      exchangeKey: 'testKey',
      secretKey: 'secretKey',
      inputSymbol: 'GBP',
      customTradingParams: '{}',
      outputSymbol: 'BTC',
      tradingPair: 'BTC/GBP',
      tradingThreshold: 0,
      withdrawalThreshold: 0,
    } as ExchangeConfiguration;

    const result: Promise<ExchangeConfiguration[]> = Promise.resolve([
      configuration,
    ]);
    jest
      .spyOn(exchangeConfigurationsService, 'findAll')
      .mockImplementation(() => result);

    const mockExchange = createMock<Exchange>({
      fetchBalance: (symbol: string) => {
        return symbol == 'BTC' ? Promise.resolve(1) : null;
      },
      hasPendingWithdrawals: (symbol: string) => {
        return symbol == 'BTC' ? Promise.resolve(false) : null;
      },
    });

    jest
      .spyOn(ExchangeFactory, 'create')
      .mockImplementation(() => mockExchange);

    await service.performDca();

    expect(mockExchange.performWithdrawal).toHaveBeenCalledWith(1, {
      apiKey: 'apiKey',
      customTradingParams: '{}',
      exchangeKey: 'testKey',
      id: 1,
      inputSymbol: 'GBP',
      outputSymbol: 'BTC',
      secretKey: 'secretKey',
      tradingPair: 'BTC/GBP',
      tradingThreshold: 0,
      withdrawalThreshold: 0,
    });
  });
});
