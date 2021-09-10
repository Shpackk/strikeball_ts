import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    googleId: string

    @Column()
    email: string

    @Column()
    name: string

    @Column()
    password: string

    @Column()
    picture: string

}