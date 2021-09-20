import { IsString } from "class-validator"

export class BanInfo {
    @IsString()
    description: string
    @IsString()
    type: string
}