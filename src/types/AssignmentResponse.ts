import { AssetResponse } from "./Asset"

export type AssignmentResponse = {
    id: number
    assignedDate: Date,
    note: string,
    assignTo: string,
    assignBy: string,
    asset: AssetResponse,
    returnDate: Date | null,
    state: string
    isNew?: boolean
}