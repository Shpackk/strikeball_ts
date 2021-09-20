import { IsEmail } from "class-validator";

export class UserForReset {
    @IsEmail({},{
        message: 'Incorrect email',
    })
    email: string
}