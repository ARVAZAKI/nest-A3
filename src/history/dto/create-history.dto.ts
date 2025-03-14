import { IsInt, IsNotEmpty } from "class-validator";

export class CreateHistoryDTO {
    @IsNotEmpty()
    @IsInt()
    program_id: number;
}
