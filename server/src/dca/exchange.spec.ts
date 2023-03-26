import {
  Balance,
  Balances,
  Currency,
  Exchange as CcxtExchange,
  Order,
  Params,
  Transaction,
  WithdrawalResponse,
} from 'ccxt';
import { Exchange } from './exchange';
import { Conversion } from './conversion';
import { createMock } from '@golevelup/ts-jest';
import { Withdrawal } from './withdrawal';
import { ExchangeConfiguration } from '../exchange-configurations/exchange-configuration.entity';

describe('Exchange', () => {
  let exchange: Exchange;
  let mockExchange: CcxtExchange;

  beforeEach(async () => {
    mockExchange = createMock<CcxtExchange>({});
    exchange = new Exchange(mockExchange);
  });

  test('should be defined', () => {
    expect(exchange).toBeDefined();
  });

  describe('fetchBalance', () => {
    beforeEach(async () => {
      const gbpBalance = {} as Balance;
      gbpBalance['used'] = 0;
      gbpBalance['free'] = 1;
      gbpBalance['total'] = 1;

      const balances = {} as Balances;
      balances['GBP'] = gbpBalance;

      mockExchange = createMock<CcxtExchange>({
        fetchBalance: () => Promise.resolve(balances),
      });
      exchange = new Exchange(mockExchange);
    });

    test('should return balance for GBP', async () => {
      expect(await exchange.fetchBalance('GBP')).toEqual(1);
    });

    test('should return zero balance for symbol that does not exist', async () => {
      expect(await exchange.fetchBalance('BTC')).toEqual(0);
    });
  });

  describe('hasPendingWithdrawals', () => {
    beforeEach(async () => {
      const transaction1 = {
        currency: 'GBP',
        status: 'pending',
      } as Transaction;

      const transaction2 = {
        currency: 'BTC',
        status: 'ok',
      } as Transaction;

      mockExchange = createMock<CcxtExchange>({
        fetchWithdrawals: (symbol: string) =>
          Promise.resolve([transaction1, transaction2]),
      });
      exchange = new Exchange(mockExchange);
    });

    test('should return false when no pending withdraws', async () => {
      expect(await exchange.hasPendingWithdrawals('BTC')).toEqual(false);
    });

    test('should return true when no pending withdraws', async () => {
      expect(await exchange.hasPendingWithdrawals('GBP')).toEqual(true);
    });
  });

  describe('performConversion', () => {
    beforeEach(async () => {
      const order = {
        id: 'test_id',
      } as Order;

      mockExchange = createMock<CcxtExchange>({
        createMarketBuyOrder: (
          symbol: string,
          amount: number,
          params?: Params,
        ) => Promise.resolve(order),
      });
      exchange = new Exchange(mockExchange);
    });

    test('should return a conversion', async () => {
      const configuration = {
        tradingPair: 'BTC/GBP',
        customTradingParams: '{"flags": ""}',
      } as ExchangeConfiguration;

      const expectedConversion = new Conversion('test_id', 'BTC/GBP', 10);
      expect(await exchange.performConversion(10, configuration)).toEqual(
        expectedConversion,
      );
    });
  });

  describe('performWithdrawal', () => {
    beforeEach(async () => {
      const withdrawalResponse = {
        id: 'test_id',
      } as WithdrawalResponse;

      const exchangeCurrencies = {};
      exchangeCurrencies['BTC'] = {
        id: 'btc',
        code: 'BTC',
        precision: 8,
        limits: { withdraw: { min: 10 } },
      } as Currency;

      mockExchange = createMock<CcxtExchange>({
        withdraw: (
          currency: string,
          amount: number,
          address: string,
          tag?: string,
          params?: Params,
        ) => Promise.resolve(withdrawalResponse),
        currencies: exchangeCurrencies,
      });
      exchange = new Exchange(mockExchange);
    });

    test('should return a withdrawal', async () => {
      const configuration = {
        outputSymbol: 'BTC',
        withdrawalSymbol: 'BTC',
        withdrawalAddress: 'bc11234567890',
        withdrawalTag: 'a_tag',
        customWithdrawParams: '{"key":"ledger"}',
      } as ExchangeConfiguration;

      const expectedWithdrawal = new Withdrawal('test_id', 'BTC', 10);
      expect(await exchange.performWithdrawal(10, configuration)).toEqual(
        expectedWithdrawal,
      );
    });

    test('should return a withdrawal when no limits exist', async () => {
      const withdrawalResponse = {
        id: 'test_id',
      } as WithdrawalResponse;

      const exchangeCurrencies = {};
      exchangeCurrencies['BTC'] = {
        id: 'btc',
        code: 'BTC',
        precision: 8,
        limits: {},
      } as Currency;

      mockExchange = createMock<CcxtExchange>({
        withdraw: (
          currency: string,
          amount: number,
          address: string,
          tag?: string,
          params?: Params,
        ) => Promise.resolve(withdrawalResponse),
        currencies: exchangeCurrencies,
      });
      exchange = new Exchange(mockExchange);

      const configuration = {
        outputSymbol: 'BTC',
        withdrawalSymbol: 'BTC',
        withdrawalAddress: 'bc11234567890',
        withdrawalTag: 'a_tag',
        customWithdrawParams: '{"key":"ledger"}',
      } as ExchangeConfiguration;

      const expectedWithdrawal = new Withdrawal('test_id', 'BTC', 10);
      expect(await exchange.performWithdrawal(10, configuration)).toEqual(
        expectedWithdrawal,
      );
    });

    test('should error when withdrawal amount below limit', async () => {
      const configuration = {
        outputSymbol: 'BTC',
        withdrawalSymbol: 'BTC',
        withdrawalAddress: 'bc11234567890',
        withdrawalTag: 'a_tag',
        customWithdrawParams: '{"key":"ledger"}',
      } as ExchangeConfiguration;

      await expect(
        exchange.performWithdrawal(5, configuration),
      ).rejects.toThrowError('Withdrawal amount below exchange limit.');
    });
  });
});
