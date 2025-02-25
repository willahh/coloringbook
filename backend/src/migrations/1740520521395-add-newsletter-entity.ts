import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewsletterEntity1740520521395 implements MigrationInterface {
  name = 'AddNewsletterEntity1740520521395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "newsletter" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "UQ_7e3d2b10221e8b16279dac58319" UNIQUE ("email"), CONSTRAINT "PK_036bb790d1d19efeacfd2f3740c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "newsletter"`);
  }
}
