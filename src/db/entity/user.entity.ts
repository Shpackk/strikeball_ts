import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./roles.entity";
import { Team } from "./teams.entity";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    googleId: string

    @Column()
    email: string

    @Column()
    name: string

    @Column({nullable:true})
    password: string

    @Column({nullable: true})
    picture: string

    @ManyToOne(() => Roles, (role: Roles) => role.id)
    role: Roles;

    @ManyToOne(() => Team, (team: Team) => team.id)
    team: number;
}
