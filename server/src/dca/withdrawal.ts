export class Withdrawal {
  id: string;
  symbol: string;
  amount: number;

  constructor(id: string, symbol: string, amount: number) {
    this.id = id;
    this.symbol = symbol;
    this.amount = amount;
  }
}
