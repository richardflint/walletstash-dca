import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExchangeConfigurationRequest } from './dto/exchange-configuration-request';
import { Conversion } from './conversion.entity';

@Entity()
export class ExchangeConfiguration {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  exchangeKey: string;
  @Column()
  apiUsername: string;
  @Column()
  apiKey: string;
  @Column()
  secretKey: string;
  @Column()
  inputSymbol: string;
  @Column()
  outputSymbol: string;
  @Column()
  tradingPair: string;
  @Column()
  withdrawalSymbol: string;
  @Column()
  withdrawalAddress: string;
  @Column()
  withdrawalTag: string;
  @Column({ nullable: true })
  customTradingParams: string;
  @Column({ nullable: true })
  customWithdrawParams: string;
  @Column()
  withdrawalEnabled: boolean;
  @Column({ default: 0 })
  tradingThreshold: number;
  @Column({ default: 0 })
  withdrawalThreshold: number;
  @OneToMany(() => Conversion, (conversion) => conversion.configuration)
  conversions: Conversion[];

  mapTo(
    exchangeConfiguration: ExchangeConfigurationRequest,
  ): ExchangeConfiguration {
    this.name = exchangeConfiguration.name;
    this.exchangeKey = exchangeConfiguration.exchangeKey;
    this.apiUsername = exchangeConfiguration.apiUsername;
    this.apiKey = exchangeConfiguration.apiKey;
    this.secretKey = exchangeConfiguration.secretKey;
    this.inputSymbol = exchangeConfiguration.inputSymbol;
    this.outputSymbol = exchangeConfiguration.outputSymbol;
    this.tradingPair = exchangeConfiguration.tradingPair;
    this.withdrawalSymbol = exchangeConfiguration.withdrawalSymbol;
    this.withdrawalAddress = exchangeConfiguration.withdrawalAddress;
    this.withdrawalTag = exchangeConfiguration.withdrawalTag;
    this.customTradingParams = exchangeConfiguration.customTradingParams;
    this.customWithdrawParams = exchangeConfiguration.customWithdrawParams;
    this.withdrawalEnabled = exchangeConfiguration.withdrawalEnabled;
    this.tradingThreshold = exchangeConfiguration.tradingThreshold;
    this.withdrawalThreshold = exchangeConfiguration.withdrawalThreshold;
    return this;
  }

  public get getLatestConversion(): Conversion {
    return this.conversions
      ?.sort(
        (a: Conversion, b: Conversion) =>
          b.datetime.getTime() - a.datetime.getTime(),
      )
      .shift();
  }
}
