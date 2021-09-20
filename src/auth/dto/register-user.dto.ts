import {  IsEmail, IsString, Length, Matches } from "class-validator"

export class RegUserDto {
    @IsEmail({},{
        message:"Bad Email"
    })
    readonly email: string

    @Length(4, 20, {
        message:"Password Lenght Should Be At Least 4 c.long till 20"
    })
    readonly name: string

    @IsString()
    role: string

    @IsString()
    @Length(6, 20)
    password: string
    
    picture?: any
}