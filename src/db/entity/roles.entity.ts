import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'roles'})
export class Roles {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}