import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookAddColumnCoverImage1737027990891
  implements MigrationInterface
{
  name = 'BookAddColumnCoverImage1737027990891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" ADD "coverImage" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "coverImage"`);
  }
}
