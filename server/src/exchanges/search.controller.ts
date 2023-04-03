import {
  Controller,
  Get,
  ParseArrayPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExchangeMarket } from './exchange-market.entity';

@Controller('search')
export class SearchController {
  constructor(private exchangesService: ExchangesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findExchanges(
    @Query(
      'inputSymbol',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    inputSymbol: string[] = [],
    @Query(
      'outputSymbol',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    outputSymbol: string[] = [],
    @Query(
      'marketSymbol',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    marketSymbol: string[] = [],
    @Query(
      'exchange',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    exchange: string[] = [],
  ): Promise<ExchangeMarket[]> {
    return await this.exchangesService.findAllExchanges(
      inputSymbol,
      outputSymbol,
      marketSymbol,
      exchange,
    );
  }
}
