import { MigrationInterface, QueryRunner } from 'typeorm';

export class conversions1682886526947 implements MigrationInterface {
  name = 'conversions1682886526947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "conversion" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "datetime" datetime NOT NULL, "externalId" varchar NOT NULL, "symbol" varchar NOT NULL, "amount" integer NOT NULL, "configurationId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_conversion" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "datetime" datetime NOT NULL, "externalId" varchar NOT NULL, "symbol" varchar NOT NULL, "amount" integer NOT NULL, "configurationId" integer, CONSTRAINT "FK_e334d735cbaf4bbce447ae04ba3" FOREIGN KEY ("configurationId") REFERENCES "exchange_configuration" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_conversion"("id", "datetime", "externalId", "symbol", "amount", "configurationId") SELECT "id", "datetime", "externalId", "symbol", "amount", "configurationId" FROM "conversion"`,
    );
    await queryRunner.query(`DROP TABLE "conversion"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_conversion" RENAME TO "conversion"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversion" RENAME TO "temporary_conversion"`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversion" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "datetime" datetime NOT NULL, "externalId" varchar NOT NULL, "symbol" varchar NOT NULL, "amount" integer NOT NULL, "configurationId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "conversion"("id", "datetime", "externalId", "symbol", "amount", "configurationId") SELECT "id", "datetime", "externalId", "symbol", "amount", "configurationId" FROM "temporary_conversion"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_conversion"`);
    await queryRunner.query(`DROP TABLE "conversion"`);
  }
}
