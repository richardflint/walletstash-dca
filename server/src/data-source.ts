import { DataSource } from 'typeorm';
import { Conversion } from './exchange-configurations/conversion.entity';
import { ExchangeConfiguration } from './exchange-configurations/exchange-configuration.entity';
import { ExchangeMarket } from './exchanges/exchange-market.entity';
import { inital1670276384719 } from './migrations/1670276384719-inital';
import { initalMarkets1678909771481 } from './migrations/1678909771481-inital_markets';
import { conversions1682886526947 } from './migrations/1682886526947-conversions';
import { User } from './users/user.entity';

const dbDir = process.env.DB_DIR || '../db/';
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbDir + 'db.sqlite',
  entities: [User, ExchangeConfiguration, ExchangeMarket, Conversion],
  synchronize: false,
  migrations: [
    inital1670276384719,
    initalMarkets1678909771481,
    conversions1682886526947,
  ],
  migrationsRun: true,
});
