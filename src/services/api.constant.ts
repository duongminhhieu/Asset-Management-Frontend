

export class APIConstants {


    static AUTH = {
        AUTHENTICATE: '/auth/authenticate',
        REGISTER: '/auth/register',
        LOG_OUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
    };

    static USER = {
        GET_USER: '/user',
        UPDATE_USER: '/user',
        CHANGE_PASSWORD: (userId: string) => `/user/${userId}/change-password`,
    };

}