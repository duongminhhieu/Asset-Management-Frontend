import ReturningRequestSearchParams from "@/types/ReturningRequestSearchParams";
import { APIConstants } from "../api.constant";
import instance from "../instance.axios";

export class ReturningRequestAPICaller {
    static getSearchReturningRequests = (returningRequestSearchParams: ReturningRequestSearchParams) => {
        return instance.get(APIConstants.RETURNING_REQUEST.GET_RETURNING_REQUESTS, {
          params: returningRequestSearchParams,
        });
      };
}