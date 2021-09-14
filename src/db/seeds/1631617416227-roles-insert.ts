import {MigrationInterface, QueryRunner} from "typeorm";

export class rolesInsert1631617416227 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .manager
            .createQueryBuilder()
            .insert()
            .into('roles')
            .values([
                { name: "admin" },
                { name: "manager" },
                {name: "user"}
            ])
            .execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('roles')   
    }
    
}
