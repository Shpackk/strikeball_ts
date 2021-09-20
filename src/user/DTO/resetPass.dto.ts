import { MaxLength, MinLength } from "class-validator"

export class PassReset{
    @MinLength(6)
    @MaxLength(20)
    newPass: string

    @MinLength(6)
    @MaxLength(20)
    confirmPass: string
}