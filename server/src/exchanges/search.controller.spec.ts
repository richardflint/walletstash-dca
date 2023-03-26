import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesService } from './exchanges.service';
import { SearchController } from './search.controller';

describe('SearchController', () => {
  let controller: SearchController;
  let service: ExchangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        ExchangesService,
        {
          provide: ExchangesService,
          useValue: {
            findAllExchanges: jest
              .fn()
              .mockResolvedValue(
                (
                  inputSymbol?: string,
                  outputSymbol?: string,
                  marketSymbol?: string,
                ) => null,
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<ExchangesService>(ExchangesService);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
