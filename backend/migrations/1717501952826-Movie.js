import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class Movie1717501952826 {
    name = 'Movie1717501952826'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "date" varchar NOT NULL
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
    }
}
