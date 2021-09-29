import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableTeams1632310851652 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(new Table({
            name: "teams",
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
                    type: "varchar",
                    isNullable:false
                },
                {
                    name: 'players',
                    type: 'varchar',
                    isNullable:true
                }
            ]
         }), true)
        .then(async () => {
            await queryRunner.manager.createQueryBuilder()
                .insert()
                .into('teams')
                .values([
                    { name: 'A' },
                    { name: 'B' }
                ])
            .execute()
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('teams')
    }

}
