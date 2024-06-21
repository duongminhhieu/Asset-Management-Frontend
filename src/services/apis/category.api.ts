import { APIConstants } from "../api.constant";
import instance from "../instance.axios";


export class CategoryAPICaller {
    static getAll = () => instance.get(APIConstants.CATEGORY.GET_ALL_CATEGORIES);

    static createNew = (body = {}) => instance.post(APIConstants.CATEGORY.CREATE_CATEGORY, body);
}