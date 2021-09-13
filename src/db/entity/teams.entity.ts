import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'teams'})
export class Team {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({nullable: true})
    players: string
}
