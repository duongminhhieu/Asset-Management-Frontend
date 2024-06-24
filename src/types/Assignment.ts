export type AssignmentHistoryDto = {
    id: number
    assignTo: string,
    assignBy: string,
    assignedDate: Date,
    returnDate: Date | null,
}