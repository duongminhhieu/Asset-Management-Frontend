import { AssetResponse } from "./Asset";
import { User } from "./User";

export type AssignmentHistoryDto = {
    id: number
    assignTo: string,
    assignBy: string,
    assignedDate: Date,
    returnDate: Date | null,
}


export type Assignment = {
    id: number;
    assignedDate: Date;
    note: string;
    state: string;
    assignTo: User;
    assignBy: User;
    asset: AssetResponse;
    returnDate: Date;
}

