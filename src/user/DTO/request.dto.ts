import { Type } from "class-transformer";
import {IsNumber } from "class-validator";

export class RequestToApprove{
    @IsNumber()
    @Type(() => Number)
    id: number
}