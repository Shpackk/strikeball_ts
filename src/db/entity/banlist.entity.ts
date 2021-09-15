import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: 'banlist'})
export class Banlist {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    userEmail: string
    
    @Column()
    description: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}
