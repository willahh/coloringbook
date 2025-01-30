import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBookTable1738267032267 implements MigrationInterface {
  name = 'UpdateBookTable1738267032267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "coverImage" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "coverImage" DROP NOT NULL`,
    );
  }
}
