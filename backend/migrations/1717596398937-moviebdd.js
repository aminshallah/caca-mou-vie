import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class Moviebdd1717596398937 {
    name = 'Moviebdd1717596398937'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "date" varchar NOT NULL,
                "synopsis" varchar,
                "duration" integer,
                "mainActors" varchar,
                "director" varchar,
                "genre" varchar,
                "posterPath" varchar
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("id", "title", "date")
            SELECT "id",
                "title",
                "date"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "date" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"("id", "title", "date")
            SELECT "id",
                "title",
                "date"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
