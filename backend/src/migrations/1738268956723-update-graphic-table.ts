import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGraphicTable1738268956723 implements MigrationInterface {
  name = 'UpdateGraphicTable1738268956723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "graphic_assets" DROP COLUMN "type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."graphic_assets_type_enum" AS ENUM('svg', 'png')`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ADD "type" "public"."graphic_assets_type_enum" NOT NULL DEFAULT 'svg'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "graphic_assets" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."graphic_assets_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ADD "type" character varying NOT NULL`,
    );
  }
}
