import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableRequests1632311388284 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(new Table({
            name: "requests",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy:'increment'
                },
                {
                    name: "userEmail",
                    type: "varchar"
                },
                {
                    name: 'userName',
                    type: "varchar",
                    isNullable:true
                },
                {
                    name: 'userPass',
                    type: "varchar",
                    isNullable:true
                },
                {
                    name: "requestType",
                    type: "enum",
                    enum: ['join', 'leave','register']
                },
                {
                    name: "teamId",
                    type:'int'
                },
                {
                    name: 'userId',
                    type:'int'
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('requests')
    }

}
