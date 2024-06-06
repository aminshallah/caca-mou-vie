import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717683275978 {
    name = ' $npmConfigName1717683275978'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_note" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "filmId" integer NOT NULL,
                "note" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_note"("id", "userId", "filmId", "note")
            SELECT "id",
                "userId",
                "filmId",
                "note"
            FROM "note"
        `);
        await queryRunner.query(`
            DROP TABLE "note"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_note"
                RENAME TO "note"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "note"
                RENAME TO "temporary_note"
        `);
        await queryRunner.query(`
            CREATE TABLE "note" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "filmId" integer NOT NULL,
                "note" integer NOT NULL,
                "ranking" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "note"("id", "userId", "filmId", "note")
            SELECT "id",
                "userId",
                "filmId",
                "note"
            FROM "temporary_note"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_note"
        `);
    }
}
