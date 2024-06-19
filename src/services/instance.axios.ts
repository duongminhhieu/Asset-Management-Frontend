import axios, { AxiosError, AxiosResponse } from "axios";
import { User } from "../types/User";
import { APIConstants } from "./api.constant";
import APIResponse from "../types/APIResponse";
import { EUserStatus } from "@/enums/UserStatus.enum";


const instance = axios.create({
    baseURL: process.env.VITE_BACKEND_URL,
    headers: {
        "Content-type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token: string | null = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


let isExpired: boolean = false;

instance.interceptors.response.use(
    (res: AxiosResponse) => {
        isExpired = false;
        const url: string | undefined = res.config.url;
        if (url === APIConstants.AUTH.LOGIN && res.data.result?.user && res.data.result?.user.status !== EUserStatus.FIRST_LOGIN) {
            const response: APIResponse = res.data;
            const user: User = response.result?.user;
            const token: string = response.result?.token;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        }
        return res;
    },
    (err: AxiosError) => {
        if (
            (err?.response?.status === 401 && !isExpired) ||
            (err?.response?.status === 403 && !isExpired)
        ) {
            isExpired = true;
            const user: User = JSON.parse(localStorage.getItem('user') as string) as User;
            if (user.id) {
                alert('Your session has expired. Please login again');
            }
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            return Promise.reject(err)
        };
    }
);

export default instance;
