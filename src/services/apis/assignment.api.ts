import AssignmentSearchParams from "@/types/AssignmentSearchParams";
import { APIConstants } from "../api.constant";
import instance from "../instance.axios";


export class AssignmentAPICaller {
    static getHistory = (assetId: number) => {
        return instance.get(APIConstants.ASSIGNMENT.HISTORY(assetId));
    }

    static createAssignment = (body = {}) => {
        return instance.post(APIConstants.ASSIGNMENT.CREATE_ASSIGNMENT, body);
    }
    static getSearchAssignments = (assetSearchParams: AssignmentSearchParams) => {
        return instance.get(APIConstants.ASSIGNMENT.GET_ASSIGNMENTS, {
            params: assetSearchParams,
        });
    };
}