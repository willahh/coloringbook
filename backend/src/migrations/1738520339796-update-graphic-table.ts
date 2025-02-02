import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGraphicTable1738520339796 implements MigrationInterface {
  name = 'UpdateGraphicTable1738520339796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."graphic_assets_type_enum" RENAME TO "graphic_assets_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."graphic_assets_type_enum" AS ENUM('svg', 'converted_svg', 'png')`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ALTER COLUMN "type" TYPE "public"."graphic_assets_type_enum" USING "type"::"text"::"public"."graphic_assets_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ALTER COLUMN "type" SET DEFAULT 'svg'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."graphic_assets_type_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."graphic_assets_type_enum_old" AS ENUM('svg', 'png')`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ALTER COLUMN "type" TYPE "public"."graphic_assets_type_enum_old" USING "type"::"text"::"public"."graphic_assets_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ALTER COLUMN "type" SET DEFAULT 'svg'`,
    );
    await queryRunner.query(`DROP TYPE "public"."graphic_assets_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."graphic_assets_type_enum_old" RENAME TO "graphic_assets_type_enum"`,
    );
  }
}
