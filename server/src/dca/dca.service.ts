import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExchangeConfigurationsService } from '../exchange-configurations/exchange-configurations.service';
import ExchangeFactory from './exchangeFactory';

@Injectable()
export class DcaService {
  private readonly logger = new Logger(DcaService.name);
  private isRunning = false;

  constructor(
    private exchangeConfigurationsService: ExchangeConfigurationsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async performDca() {
    if (!this.isRunning) {
      this.isRunning = true;
      const configurations = await this.exchangeConfigurationsService.findAll();
      for (const configuration of configurations) {
        try {
          this.logger.debug(
            `Running configuration ${configuration.id} ${configuration.name}`,
          );
          const exchange = ExchangeFactory.create(
            configuration.exchangeKey,
            configuration.apiKey,
            configuration.secretKey,
          );

          const inputBalance = await exchange.fetchBalance(
            configuration.inputSymbol,
          );
          this.logger.debug(
            `Balance for ${configuration.inputSymbol} is ${inputBalance}`,
          );
          if (
            inputBalance > 0 &&
            inputBalance > configuration.tradingThreshold
          ) {
            const conversion = await exchange.performConversion(
              inputBalance,
              configuration,
            );
            this.logger.log(
              `Conversion: ${conversion.id}, ${conversion.symbol}, ${conversion.amount}`,
            );
          }

          const hasPendingWithdrawals = await exchange.hasPendingWithdrawals(
            configuration.outputSymbol,
          );
          this.logger.debug(
            `${configuration.outputSymbol} pending withdrawals: ${hasPendingWithdrawals}`,
          );
          const outputBalance = await exchange.fetchBalance(
            configuration.outputSymbol,
          );
          this.logger.debug(
            `Balance for ${configuration.outputSymbol} is ${outputBalance}`,
          );
          if (
            !hasPendingWithdrawals &&
            outputBalance > 0 &&
            outputBalance > configuration.withdrawalThreshold
          ) {
            const withdrawn = await exchange.performWithdrawal(
              outputBalance,
              configuration,
            );
            this.logger.log(
              `Withdrawal: ${withdrawn.id}, ${withdrawn.symbol}, ${withdrawn.amount}`,
            );
          }
        } catch (err) {
          this.logger.error(
            `Failed to run configuration ${configuration.id} ${configuration.name}`,
          );
          this.logger.log({ level: 'error', message: err });
        }
      }
      this.isRunning = false;
    }
  }
}
