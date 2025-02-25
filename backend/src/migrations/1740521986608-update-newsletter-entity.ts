import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNewsletterEntity1740521986608 implements MigrationInterface {
    name = 'UpdateNewsletterEntity1740521986608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "newsletter" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "newsletter" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "newsletter" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "newsletter" DROP COLUMN "createdAt"`);
    }

}
