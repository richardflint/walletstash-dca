import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { ExchangeMarketDto } from './dto/exchange-market.dto';

@Entity()
@Index(['base', 'quote'])
export class ExchangeMarket {
  @PrimaryColumn()
  id: string;
  @Column()
  base: string;
  @Column()
  quote: string;
  @Column()
  market: string;
  @Column()
  exchangeId: string;
  @Column()
  exchangeName: string;

  constructor(
    base: string,
    quote: string,
    market: string,
    exchangeId: string,
    exchangeName: string,
  ) {
    this.id = base + '_' + quote + '_' + market + '_' + exchangeId;
    this.base = base;
    this.quote = quote;
    this.market = market;
    this.exchangeId = exchangeId;
    this.exchangeName = exchangeName;
  }

  mapTo(exchangeMarket: ExchangeMarketDto): ExchangeMarket {
    this.id = exchangeMarket.id;
    this.base = exchangeMarket.base;
    this.quote = exchangeMarket.quote;
    this.market = exchangeMarket.market;
    this.exchangeId = exchangeMarket.exchangeId;
    this.exchangeName = exchangeMarket.exchangeName;
    return this;
  }
}
