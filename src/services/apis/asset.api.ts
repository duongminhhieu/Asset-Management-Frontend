import AssetSearchParams from "@/types/AssetSearchParams";
import { APIConstants } from "../api.constant";
import instance from "../instance.axios";

export class AssetAPICaller {
  static createNew = (body = {}) =>
    instance.post(APIConstants.ASSET.CREATE_ASSET, body);

  static getSearchAssets = (assetSearchParams: AssetSearchParams) => {
    return instance.get(APIConstants.ASSET.GET_ASSETS, {
      params: assetSearchParams,
    });
  };
}
