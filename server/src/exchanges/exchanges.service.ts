import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { Market } from 'ccxt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ExchangeMarket } from './exchange-market.entity';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(ExchangeMarket)
    private exchangeMarketRepository: Repository<ExchangeMarket>,
  ) {}

  async findAllExchanges(
    inputSymbol?: string[],
    outputSymbol?: string[],
    marketSymbol?: string[],
    exchange?: string[],
  ): Promise<ExchangeMarket[]> {
    await this.fetchAllMarkets();

    let where = [];

    if (
      inputSymbol &&
      inputSymbol.length > 0 &&
      outputSymbol &&
      outputSymbol.length > 0
    ) {
      where.push(
        { base: In(inputSymbol), quote: In(outputSymbol) },
        { base: In(outputSymbol), quote: In(inputSymbol) },
      );
    }

    if (
      inputSymbol &&
      inputSymbol.length > 0 &&
      (!outputSymbol || outputSymbol.length == 0)
    ) {
      where.push({ base: In(inputSymbol) }, { quote: In(inputSymbol) });
    }

    if (exchange && exchange.length > 0) {
      if (where.length > 0) {
        where = where.map((item) => ({
          ...item,
          exchangeId: In(exchange),
        }));
      } else {
        where.push({ exchangeId: In(exchange) });
      }
    }

    if (marketSymbol && marketSymbol.length > 0) {
      if (where.length > 0) {
        where = where.map((item) => ({
          ...item,
          market: In(marketSymbol),
        }));
      } else {
        where.push({ market: In(marketSymbol) });
      }
    }

    if (where.length > 0) {
      return this.exchangeMarketRepository.find({
        where: [...where],
        order: {
          id: 'DESC',
        },
      });
    } else {
      return this.exchangeMarketRepository.find({
        order: {
          id: 'DESC',
        },
      });
    }
  }

  private async fetchAllMarkets(): Promise<void> {
    const excludeList = ['buda'];
    const value: number = await this.exchangeMarketRepository.count();

    if (value === 0) {
      for (const exchangeName of ccxt.exchanges) {
        if (excludeList.indexOf(exchangeName) === -1) {
          const exchange: ccxt.Exchange = new ccxt[exchangeName]();
          if (
            exchange.has['withdraw'] &&
            exchange.has['fetchBalance'] &&
            exchange.has['createMarketOrder']
          ) {
            try {
              const maybeMarkets: Promise<Market[]>[] = [];
              maybeMarkets.push(exchange.fetchMarkets());

              const fetchedMarkets = await Promise.allSettled(maybeMarkets);

              for (const fetchedMarket of fetchedMarkets) {
                if (fetchedMarket.status === 'fulfilled') {
                  for (const market of fetchedMarket.value) {
                    if (market.spot) {
                      const exchangeMarket = new ExchangeMarket(
                        market.base,
                        market.quote,
                        market.symbol,
                        exchange.id,
                        exchange.name,
                      );
                      await this.exchangeMarketRepository.save(exchangeMarket);
                    }
                  }
                } else {
                  console.error(
                    'Unable to fetch markets: ',
                    fetchedMarket.reason,
                  );
                }
              }
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
    }
  }
}
