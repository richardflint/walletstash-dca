import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesService } from './exchanges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeMarket } from './exchange-market.entity';
import { DataSource } from 'typeorm';

const databaseName = 'db/tests/exchangesService.sqlite';

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: databaseName,
  entities: [ExchangeMarket],
  dropSchema: true,
  synchronize: true,
});

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({ ...AppDataSource.options }),
  TypeOrmModule.forFeature([ExchangeMarket]),
];

const testDatasetSeed = async () => {
  const entityManager = AppDataSource.createEntityManager();
  await entityManager.insert<ExchangeMarket>(ExchangeMarket, {
    id: '1234',
    base: 'BTC',
    quote: 'GBP',
    exchangeId: 'test',
    exchangeName: 'Test',
    market: 'GBP/BTC',
  });
  await entityManager.insert<ExchangeMarket>(ExchangeMarket, {
    id: '12345',
    base: 'USD',
    quote: 'GBP',
    exchangeId: 'test',
    exchangeName: 'Test',
    market: 'GBP/USD',
  });
};

describe('ExchangesService', () => {
  let service: ExchangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [ExchangesService],
    }).compile();

    service = module.get<ExchangesService>(ExchangesService);
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await testDatasetSeed();
  });

  test('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('findAllExchanges', () => {
    test('add inputSymbol to where and not outputSymbol when outputSymbol null', async () => {
      const inputSymbol = ['BTC'];
      const markets = await service.findAllExchanges(inputSymbol);
      expect(markets).toEqual([
        {
          id: '1234',
          base: 'BTC',
          quote: 'GBP',
          exchangeId: 'test',
          exchangeName: 'Test',
          market: 'GBP/BTC',
        } as ExchangeMarket,
      ]);
    });
  });
});
