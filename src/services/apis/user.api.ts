import axios, { AxiosRequestConfig } from "axios";
import { APIConstants } from "../api.constant";
import instance from "../instance.axios";
import UserSearchParams from "@/types/UserSearchParams";
import { UserRequest } from "@/types/UserRequest";

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

  static getUsernameGenerated = (firstName: string, lastName: string) => {
    return instance.get(APIConstants.USER.GENERATE_USERNAME, {
      params: { firstName, lastName },
    });
  };

  static createUser = (userData: UserRequest) =>
    instance.post(APIConstants.USER.CREATE_USER, userData);


  static getSearchUser = (userSearchParams: UserSearchParams) => {
    return instance.get(APIConstants.USER.GET_USERS, {
      params: userSearchParams,
    });
  };
  static getUserAssign = (userSearchParams: UserSearchParams) => {
    return instance.get(APIConstants.USER.GET_USER_ASSIGN, {
      params: userSearchParams,
    });
  };

  static changePassword = (body = {}) =>
    instance.patch(APIConstants.USER.CHANGE_PASSWORD, body);
}
