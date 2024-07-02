import { Assignment } from "./Assignment";
import { User } from "./User";

export type ReturningRequest = {
    id: number,
    assignment: Assignment,
    returnDate: Date,
    state: string,
    requestedBy: User,
    acceptedBy: User
    isNew?: boolean
}