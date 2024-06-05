import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717594048349 {
    name = ' $npmConfigName1717594048349'

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
            INSERT INTO "temporary_movie"(
                    "id",
                    "title",
                    "date",
                    "synopsis",
                    "duration",
                    "mainActors",
                    "director",
                    "genre"
                )
            SELECT "id",
                "title",
                "date",
                "synopsis",
                "duration",
                "mainActors",
                "director",
                "genre"
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
                "date" varchar NOT NULL,
                "synopsis" varchar,
                "duration" integer,
                "mainActors" varchar,
                "director" varchar,
                "genre" varchar
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "title",
                    "date",
                    "synopsis",
                    "duration",
                    "mainActors",
                    "director",
                    "genre"
                )
            SELECT "id",
                "title",
                "date",
                "synopsis",
                "duration",
                "mainActors",
                "director",
                "genre"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
