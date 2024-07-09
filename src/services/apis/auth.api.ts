import { APIConstants } from "../api.constant";
import instance from "../instance.axios";


export class AuthAPICaller {
    static login = (body = {}) => instance.post(APIConstants.AUTH.LOGIN, body);
    static logout = () => instance.post(APIConstants.AUTH.LOGOUT, {});
}

