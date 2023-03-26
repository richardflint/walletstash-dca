import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { ExchangeConfiguration } from './exchange-configurations/exchange-configuration.entity';
import { inital1670276384719 } from './migrations/1670276384719-inital';
import { initalMarkets1678909771481 } from './migrations/1678909771481-inital_markets';
import { ExchangeMarket } from './exchanges/exchange-market.entity';

const dbDir = process.env.DB_DIR || '../db/';
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbDir + 'db.sqlite',
  entities: [User, ExchangeConfiguration, ExchangeMarket],
  synchronize: false,
  migrations: [inital1670276384719, initalMarkets1678909771481],
  migrationsRun: true,
});
