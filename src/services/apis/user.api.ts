import axios, { AxiosRequestConfig } from 'axios';
import { APIConstants } from '../api.constant';
import instance from '../instance.axios';

export class UserAPICaller {
    static getMe = () => instance.get(APIConstants.USER.GET_USER);

    static firstChangePassword = (body = {}, token: string) => {
        const config: AxiosRequestConfig = {
            baseURL: process.env.VITE_BACKEND_URL,

            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json',
            },
        };
        return axios.patch(APIConstants.USER.FIRST_CHANGE_PASSWORD, body, config)
    };

}
