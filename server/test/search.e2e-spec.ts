import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ExchangesModule } from '../src/exchanges/exchanges.module';
import { AuthModule } from '../src/auth/auth.module';
import { verbose } from 'sqlite3';
import * as fs from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { ExchangeMarket } from '../src/exchanges/exchange-market.entity';

describe('SearchController (e2e)', () => {
  let app: INestApplication;

  const databaseName = 'db/tests/searchController.sqlite';

  const removeDb = () => {
    try {
      if (fs.existsSync(databaseName)) {
        fs.unlinkSync(databaseName);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createTestDataSet = () => {
    const sqlite3 = verbose();
    const db = new sqlite3.Database(databaseName);

    db.run(`INSERT INTO user
            (id, username, password, isActive)
            VALUES (1, 'john', '$2b$10$quglrn9l0/noKkIN8Yr8rOqtIP6iAyu8.rtRhuggurbRw9uoYEBpG', true)`);
    db.run(`INSERT INTO exchange_market
            (id, base, quote, market, exchangeId, exchangeName)
            VALUES ('XTZ_GBP_XTZ/GBP_kraken', 'XTZ', 'GBP', 'XTZ/GBP', 'kraken', 'Kraken')`);
    db.run(`INSERT INTO exchange_market
            (id, base, quote, market, exchangeId, exchangeName)
            VALUES ('XTZ_USD_XTZ/GBP_kraken', 'XTZ', 'USD', 'XTZ/USD', 'kraken', 'Kraken')`);
  };

  beforeEach(async () => {
    removeDb();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: databaseName,
          entities: [User, ExchangeMarket],
          synchronize: true,
        }),
        ExchangesModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    createTestDataSet();
  });

  it('findAll [GET /search]', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'john', password: 'changeme' })
      .expect(201);

    const token = loginReq.body.access_token;

    return request(app.getHttpServer())
      .get('/api/search?inputSymbol=GBP')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toEqual(1);
        expect(body[0]).toEqual({
          id: 'XTZ_GBP_XTZ/GBP_kraken',
          base: 'XTZ',
          quote: 'GBP',
          market: 'XTZ/GBP',
          exchangeId: 'kraken',
          exchangeName: 'Kraken',
        });
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
