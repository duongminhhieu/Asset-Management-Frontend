import { APIConstants } from "../api.constant";
import instance from "../instance.axios";

export class LocationAPICaller {
  static getAllLocations = () =>
    instance.get(APIConstants.LOCATION.GET_ALL_LOCATIONS);

  static createLocation = (location = {}) =>
    instance.post(APIConstants.LOCATION.CREATE_LOCATION, location);
}
