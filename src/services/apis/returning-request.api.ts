import ReturningRequestSearchParams from "@/types/ReturningRequestSearchParams";
import { APIConstants } from "../api.constant";
import instance from "../instance.axios";

export class ReturningRequestAPICaller {
  static getSearchReturningRequests = (
    returningRequestSearchParams: ReturningRequestSearchParams
  ) => {
    return instance.get(APIConstants.RETURNING_REQUEST.GET_RETURNING_REQUESTS, {
      params: returningRequestSearchParams,
    });
  };

  static cancelReturningRequest = (id: number) => {
    return instance.delete(
      APIConstants.RETURNING_REQUEST.CANCEL_RETURNING_REQUEST(id)
    );
  };

  static completeReturningRequest = (id: number) => {
    return instance.patch(
      APIConstants.RETURNING_REQUEST.COMPLETE_RETURNING_REQUEST(id)
    );
  };
  static createReturningRequestAtHomePage = (id: number) => {
    return instance.post(
      APIConstants.RETURNING_REQUEST.CREATE_RETURNING_REQUEST_HOME_PAGE(id)
    );
  };
  static adminCreateReturningRequest = (id: number) => {
    return instance.post(
      APIConstants.RETURNING_REQUEST.CREATE_RETURNING_REQUEST_ADMIN_PAGE(id)
    );
  };
}
