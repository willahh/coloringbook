import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBookEntity1738581096732 implements MigrationInterface {
  name = 'UpdateBookEntity1738581096732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "coverImage" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "coverImage" SET NOT NULL`,
    );
  }
}
