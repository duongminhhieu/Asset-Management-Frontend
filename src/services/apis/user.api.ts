import axios, { AxiosRequestConfig } from "axios";
import { APIConstants } from "../api.constant";
import instance from "../instance.axios";
import UserSearchParams from "@/types/UserSearchParams";

export class UserAPICaller {
  static firstChangePassword = (body = {}, token: string) => {
    const config: AxiosRequestConfig = {
      baseURL: process.env.VITE_BACKEND_URL,

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    };
    return axios.patch(APIConstants.USER.FIRST_CHANGE_PASSWORD, body, config);
  };

  static getSearchUser = (userSearchParams: UserSearchParams) => {
    console.log(userSearchParams);

    return instance.get(APIConstants.USER.GET_USERS, {
      params: userSearchParams,
    });
  };

  static changePassword = (body = {}) =>
    instance.patch(APIConstants.USER.CHANGE_PASSWORD, body);
}
