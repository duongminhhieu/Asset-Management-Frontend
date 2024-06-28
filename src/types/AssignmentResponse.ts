import { Asset } from "./Asset"

export type AssignmentResponse = {
    id: number
    assignedDate: Date,
    note: string,
    assignTo: string,
    assignBy: string,
    asset: Asset,
    returnDate: Date | null,
    state: string
}