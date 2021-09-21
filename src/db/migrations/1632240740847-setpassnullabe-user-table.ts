import {MigrationInterface, QueryRunner} from "typeorm";

export class setpassnullabeUserTable1632240740847 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE users ALTER COLUMN password DROP NOT NULL;')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE users ALTER COLUMN password SET NOT NULL')
    }

}
