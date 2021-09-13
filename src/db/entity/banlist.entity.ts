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

    @OneToOne(() => User, (user: User) => user.id)
    @JoinColumn()
    user: number
}
