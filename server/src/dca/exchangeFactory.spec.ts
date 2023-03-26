import ExchangeFactory from './exchangeFactory';

describe('ExchangeFactory', () => {
  test('should create an exchange', () => {
    const exchange = ExchangeFactory.create('kraken', 'apiKey', 'secret');
    expect(exchange).toBeDefined();
  });
});
