import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { Roles } from "../entity/roles.entity";
import { User } from "../entity/user.entity";

export class createTableUsers1632310324360 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: "googleId",
                    type: "varchar",
                    isNullable:true
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable:true
                },
                {
                    name: 'name',
                    type:'varchar'
                },
                {
                    name: 'password',
                    type: 'varchar',
                    isNullable:true
                },
                {
                    name: 'picture',
                    type: 'varchar',
                    isNullable:true
                },
                {
                    name: 'roleId',
                    type: 'int',
                    isNullable:true
                },
                {
                    name: 'teamId',
                    type: 'int',
                    isNullable:true
                }

            ]
        }), true)

        const role = new Roles
        role.name = 'admin'
        role.id = 3
        await queryRunner
            .manager
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                {
                    email: 'admin@google.com',
                    name: 'admin',
                    password: '$2a$10$HCiJNmjFUBrAoLbRUKexuuf9LLSOLPSeZDIqv/okIebRQZIKzA3MC',
                    role: role
                }
            ])
        .execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }
}
