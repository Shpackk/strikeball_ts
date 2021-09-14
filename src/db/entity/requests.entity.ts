import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum reqType {
    JOIN = "join",
    LEAVE = "leave",
    REGISTER = "register"
}

@Entity({name:"requests"})
export class Requests {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userEmail: string

    @Column({nullable:true})
    userName: string

    @Column({nullable: true})
    userPass: string

    @Column({
        type: "enum",
        enum: reqType,
        default: reqType.JOIN
    })
    requestType: reqType

    @Column({nullable: true})
    teamId: number

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}
