import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ExchangeConfiguration } from '../src/exchange-configurations/exchange-configuration.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';

import { verbose } from 'sqlite3';
import { ExchangeConfigurationsModule } from '../src/exchange-configurations/exchange-configurations.module';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/users/user.entity';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('ExchangeConfigurationsController (e2e)', () => {
  let app: INestApplication;

  const databaseName = 'db/tests/exchangeConfigurationsController.sqlite';

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

    db.run(`INSERT INTO exchange_configuration
            (id, name, exchangeKey, apiUsername, apiKey, secretKey, inputSymbol, outputSymbol, tradingPair,
             withdrawalSymbol, withdrawalAddress, withdrawalTag, customTradingParams, customWithdrawParams,
             withdrawalEnabled, tradingThreshold, withdrawalThreshold)
            VALUES (1, 'test configuration 1', 'exchangeKey', 'apiUsername', 'apiKey', 'secretKey', 'inputSymbol',
                    'outputSymbol', 'tradingPair', 'withdrawalSymbol', 'withdrawalAddress', 'withdrawalTag',
                    'customTradingParams', 'customWithdrawParams', 1, 0.1, 0.1)`);

    db.run(`INSERT INTO user
            (id, username, password, isActive)
            VALUES (1, 'john', '$2b$10$quglrn9l0/noKkIN8Yr8rOqtIP6iAyu8.rtRhuggurbRw9uoYEBpG', true)`);
  };

  beforeEach(async () => {
    removeDb();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: databaseName,
          entities: [ExchangeConfiguration, User],
          synchronize: true,
        }),
        ExchangeConfigurationsModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    createTestDataSet();
    await delay(125);
  });

  it('create [POST /exchange-configurations]', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'john', password: 'changeme' })
      .expect(201);

    const token = loginReq.body.access_token;

    const configuration = {
      name: 'test configuration 2',
      exchangeKey: 'exchangeKey',
      apiUsername: 'apiUsername',
      apiKey: 'apiKey',
      secretKey: 'secretKey',
      inputSymbol: 'inputSymbol',
      outputSymbol: 'outputSymbol',
      tradingPair: 'tradingPair',
      withdrawalSymbol: 'withdrawalSymbol',
      withdrawalAddress: 'withdrawalAddress',
      withdrawalTag: 'withdrawalTag',
      customTradingParams: 'customTradingParams',
      customWithdrawParams: 'customWithdrawParams',
      withdrawalEnabled: true,
      tradingThreshold: 1,
      withdrawalThreshold: 1,
    } as ExchangeConfiguration;

    return request(app.getHttpServer())
      .post('/api/exchange-configurations')
      .send(configuration as ExchangeConfiguration)
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({ id: 2, ...configuration });

        const sqlite3 = verbose();
        const db = new sqlite3.Database(databaseName);

        db.get(
          `SELECT count(1) as count
           from exchange_configuration
           where name = 'test configuration 2'`,
          (err, row) => {
            expect(row.count).toEqual(1);
          },
        );
      });
  });

  it('update [PUT /exchange-configurations/1]', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'john', password: 'changeme' })
      .expect(201);

    const token = loginReq.body.access_token;

    const configuration = {
      name: 'updated test configuration',
      exchangeKey: 'exchangeKey',
      apiUsername: 'apiUsername',
      apiKey: 'apiKey',
      secretKey: 'secretKey',
      inputSymbol: 'inputSymbol',
      outputSymbol: 'outputSymbol',
      tradingPair: 'tradingPair',
      withdrawalSymbol: 'withdrawalSymbol',
      withdrawalAddress: 'withdrawalAddress',
      withdrawalTag: 'withdrawalTag',
      customTradingParams: 'customTradingParams',
      customWithdrawParams: 'customWithdrawParams',
      withdrawalEnabled: true,
      tradingThreshold: 1,
      withdrawalThreshold: 1,
    } as ExchangeConfiguration;

    return request(app.getHttpServer())
      .put('/api/exchange-configurations/1')
      .send(configuration as ExchangeConfiguration)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ id: 1, ...configuration });

        const sqlite3 = verbose();
        const db = new sqlite3.Database(databaseName);

        db.get(
          `SELECT *
           from exchange_configuration
           where id = 1`,
          (err, row) => {
            expect(row).toEqual({
              id: 1,
              name: 'updated test configuration',
              exchangeKey: 'exchangeKey',
              apiUsername: 'apiUsername',
              apiKey: 'apiKey',
              secretKey: 'secretKey',
              inputSymbol: 'inputSymbol',
              outputSymbol: 'outputSymbol',
              tradingPair: 'tradingPair',
              withdrawalSymbol: 'withdrawalSymbol',
              withdrawalAddress: 'withdrawalAddress',
              withdrawalTag: 'withdrawalTag',
              customTradingParams: 'customTradingParams',
              customWithdrawParams: 'customWithdrawParams',
              withdrawalEnabled: 1,
              tradingThreshold: 1,
              withdrawalThreshold: 1,
            });
          },
        );
      });
  });

  it('findAll [GET /exchange-configurations]', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'john', password: 'changeme' })
      .expect(201);

    const token = loginReq.body.access_token;
    return request(app.getHttpServer())
      .get('/api/exchange-configurations')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toEqual(1);
        expect(body[0]).toEqual({
          id: 1,
          name: 'test configuration 1',
          exchangeKey: 'exchangeKey',
          apiUsername: 'apiUsername',
          apiKey: 'apiKey',
          secretKey: 'secretKey',
          inputSymbol: 'inputSymbol',
          outputSymbol: 'outputSymbol',
          tradingPair: 'tradingPair',
          withdrawalSymbol: 'withdrawalSymbol',
          withdrawalAddress: 'withdrawalAddress',
          withdrawalTag: 'withdrawalTag',
          customTradingParams: 'customTradingParams',
          customWithdrawParams: 'customWithdrawParams',
          withdrawalEnabled: true,
          tradingThreshold: 0.1,
          withdrawalThreshold: 0.1,
        });
      });
  });

  it('findOne [GET /exchange-configurations/1]', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'john', password: 'changeme' })
      .expect(201);

    const token = loginReq.body.access_token;
    return request(app.getHttpServer())
      .get('/api/exchange-configurations/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          id: 1,
          name: 'test configuration 1',
          exchangeKey: 'exchangeKey',
          apiUsername: 'apiUsername',
          apiKey: 'apiKey',
          secretKey: 'secretKey',
          inputSymbol: 'inputSymbol',
          outputSymbol: 'outputSymbol',
          tradingPair: 'tradingPair',
          withdrawalSymbol: 'withdrawalSymbol',
          withdrawalAddress: 'withdrawalAddress',
          withdrawalTag: 'withdrawalTag',
          customTradingParams: 'customTradingParams',
          customWithdrawParams: 'customWithdrawParams',
          withdrawalEnabled: true,
          tradingThreshold: 0.1,
          withdrawalThreshold: 0.1,
        });
      });
  });

  it('remove [DELETE /exchange-configurations/1]', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'john', password: 'changeme' })
      .expect(201);

    const token = loginReq.body.access_token;
    return request(app.getHttpServer())
      .delete('/api/exchange-configurations/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(() => {
        const sqlite3 = verbose();
        const db = new sqlite3.Database(databaseName);

        db.get(
          `SELECT count(1) as count
           from exchange_configuration`,
          (err, row) => {
            expect(row.count).toEqual(0);
          },
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
