import { APIConstants } from '../api.constant';
import instance from '../instance.axios';

export class UserAPICaller {
    static getMe = () => instance.get(APIConstants.USER.GET_USER);

}
