import {
  Transaction,
  Exchange as CcxtExchange,
  WithdrawalResponse,
} from 'ccxt';
import { Conversion } from './conversion';
import { Withdrawal } from './withdrawal';
import { ExchangeConfiguration } from '../exchange-configurations/exchange-configuration.entity';

export class Exchange {
  private exchange: CcxtExchange;

  constructor(exchange: any) {
    this.exchange = exchange;
    this.exchange.loadMarkets();
  }

  async fetchBalance(symbol: string): Promise<number> {
    const balances = await this.exchange.fetchBalance();
    const balance = balances[symbol]?.total;
    return balance ? balance : 0;
  }

  async performConversion(
    amount: number,
    configuration: ExchangeConfiguration,
  ): Promise<Conversion> {
    const symbol = configuration.tradingPair;
    const params = JSON.parse(configuration.customTradingParams);
    const trade = await this.exchange.createMarketBuyOrder(
      symbol,
      amount,
      params,
    );
    return new Conversion(trade.id, symbol, amount);
  }

  async performWithdrawal(
    amount: number,
    configuration: ExchangeConfiguration,
  ): Promise<Withdrawal> {
    const minWithdrawLimit = this.getMinWithdrawLimit(
      configuration.outputSymbol,
    );

    const withdrawalFee = this.getWithdrawalFee(configuration.outputSymbol);
    const amountWithoutFee = amount - withdrawalFee;

    if (!minWithdrawLimit || amountWithoutFee >= minWithdrawLimit) {
      const withdrawal: WithdrawalResponse = await this.exchange.withdraw(
        configuration.withdrawalSymbol,
        amountWithoutFee,
        configuration.withdrawalAddress,
        configuration.withdrawalTag,
        JSON.parse(configuration.customWithdrawParams),
      );

      return new Withdrawal(
        withdrawal.id,
        configuration.withdrawalSymbol,
        amountWithoutFee,
      );
    } else {
      throw new Error('Withdrawal amount below exchange limit.');
    }
  }

  async hasPendingWithdrawals(symbol: string): Promise<boolean> {
    const withdrawals = await this.exchange.fetchWithdrawals(symbol);
    const pending = withdrawals.find(
      (x) => x.status == 'pending' && x.currency == symbol,
    ) as Transaction;
    return !!pending;
  }

  private getMinWithdrawLimit(outputSymbol: string): number {
    return this.exchange.currencies[outputSymbol]['limits'].withdraw?.min;
  }

  private getWithdrawalFee(outputSymbol: string): number {
    return this.exchange.currencies[outputSymbol]['fee'];
  }
}
