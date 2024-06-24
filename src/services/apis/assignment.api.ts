import { APIConstants } from "../api.constant";
import instance from "../instance.axios";


export class AssignmentAPICaller {
    static getHistory = (assetId: number) =>{
        return instance.get(APIConstants.ASSIGNMENT.HISTORY(assetId));
    }
}