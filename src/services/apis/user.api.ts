import { APIConstants } from '../api.constant';
import instance from '../instance.axios';


export const getMe = () => instance.get(APIConstants.USER.GET_USER);