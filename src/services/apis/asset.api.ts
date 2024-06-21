import { APIConstants } from "../api.constant";
import instance from "../instance.axios";


export class AssetAPICaller {
    static createNew = (body = {}) => instance.post(APIConstants.ASSET.CREATE_ASSET, body);
}