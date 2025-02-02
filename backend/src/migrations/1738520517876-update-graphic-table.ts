import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGraphicTable1738520517876 implements MigrationInterface {
  name = 'UpdateGraphicTable1738520517876';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ADD "fullPath" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" ADD "vectPath" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" DROP COLUMN "vectPath"`,
    );
    await queryRunner.query(
      `ALTER TABLE "graphic_assets" DROP COLUMN "fullPath"`,
    );
  }
}
