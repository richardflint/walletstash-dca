export class ExchangeConfigurationRequest {
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
}
