import { IsEmail, IsOptional, Length } from "class-validator"

export class UpdateProfileBody {
    @IsOptional()
    @Length(6,20)
    newPass?: string

    @IsOptional()
    @Length(6,20)
    confirmPass?: string

    @IsOptional()
    picture?: any

    @IsOptional()
    @Length(4,20)
    name?: string

    @IsOptional()
    @IsEmail()
    email?: string
}