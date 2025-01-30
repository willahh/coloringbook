import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGraphicAssetsTable1738268290034 implements MigrationInterface {
  name = 'AddGraphicAssetsTable1738268290034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "graphic_assets" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "path" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c490fdafd8d63bc6b6290133b95" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "graphic_assets"`);
  }
}
