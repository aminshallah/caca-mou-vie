import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class Ranking1717686058805 {
    name = 'Ranking1717686058805'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "note" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "filmId" integer NOT NULL,
                "note" integer NOT NULL
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "note"
        `);
    }
}
