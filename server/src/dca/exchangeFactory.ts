import * as ccxt from 'ccxt';
import { Exchange } from './exchange';

export default class ExchangeFactory {
  public static create(
    exchangeKey: string,
    apiKey: string,
    secret: string,
  ): Exchange {
    const exchange = new ccxt[exchangeKey]({
      apiKey: apiKey,
      secret: secret,
    });
    return new Exchange(exchange);
  }
}
