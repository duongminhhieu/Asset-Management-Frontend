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

  static deleteAsset = (id: number) =>
    instance.delete(APIConstants.ASSET.DELETE_ASSET(id));

  static getAssetHistory = (id: number) =>
    instance.get(APIConstants.ASSET.GET_ASSET_HISTORY(id));

  static getAsset = (id : number) =>
    instance.get(APIConstants.ASSET.GET_ASSET(id));

  static editAsset = ({
    assetId,
    body = {},
  }: {
    assetId: number;
    body?: any;
  }) => {
    return instance.put(
      APIConstants.ASSET.EDIT_ASSET(assetId),
      body
    );
  };
}
