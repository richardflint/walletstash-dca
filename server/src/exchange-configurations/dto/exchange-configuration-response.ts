export class ConversionResponse {
  id: number;
  datetime: Date;
  externalId: string;
  symbol: string;
  amount: number;
}

export class ExchangeConfigurationResponse {
  id: number;
  name: string;
  exchangeKey: string;
  apiUsername: string;
  apiKey: string;
  secretKey: string;
  inputSymbol: string;
  outputSymbol: string;
  tradingPair: string;
  withdrawalSymbol: string;
  withdrawalAddress: string;
  withdrawalTag: string;
  customTradingParams: string;
  customWithdrawParams: string;
  withdrawalEnabled: boolean;
  tradingThreshold: number;
  withdrawalThreshold: number;
  latestConversion: ConversionResponse;
}
