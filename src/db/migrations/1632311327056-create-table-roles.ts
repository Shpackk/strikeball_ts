import {createQueryBuilder, MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableRoles1632311327056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(new Table({
            name: "roles",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy:'increment'
                },
                {
                    name: "name",
                    type: "varchar"
                }
            ]
         }), true)
            .then(async () => {
            await queryRunner.manager.createQueryBuilder()
                .insert()
                .into('roles')
                .values([
                    {name: 'user' },
                    { name: 'manager' },
                    { name: 'admin' }
                ])
            .execute()
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('roles')
    }

}
