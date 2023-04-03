import { MigrationInterface, QueryRunner } from 'typeorm';

export class inital1670276384719 implements MigrationInterface {
  name = 'inital1670276384719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "isActive" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exchange_configuration" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "exchangeKey" varchar NOT NULL, "apiUsername" varchar NOT NULL, "apiKey" varchar NOT NULL, "secretKey" varchar NOT NULL, "inputSymbol" varchar NOT NULL, "outputSymbol" varchar NOT NULL, "tradingPair" varchar NOT NULL, "withdrawalSymbol" varchar NOT NULL, "withdrawalAddress" varchar NOT NULL, "withdrawalTag" varchar NOT NULL, "customTradingParams" varchar, "customWithdrawParams" varchar, "withdrawalEnabled" boolean NOT NULL, "tradingThreshold" integer NOT NULL DEFAULT (0), "withdrawalThreshold" integer NOT NULL DEFAULT (0))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exchange_market" ("id" varchar PRIMARY KEY NOT NULL, "base" varchar NOT NULL, "quote" varchar NOT NULL, "market" varchar NOT NULL, "exchangeId" varchar NOT NULL, "exchangeName" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f808bc3605dcbe5126a121845d" ON "exchange_market" ("base", "quote") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_f808bc3605dcbe5126a121845d"`);
    await queryRunner.query(`DROP TABLE "exchange_market"`);
    await queryRunner.query(`DROP TABLE "exchange_configuration"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
