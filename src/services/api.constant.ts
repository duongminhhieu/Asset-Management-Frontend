

export class APIConstants {


    static AUTH = {
        LOGIN: '/auth/login',
    };

    static USER = {
        GET_USER: '/user',
        UPDATE_USER: '/user',
        CHANGE_PASSWORD: (userId: string) => `/user/${userId}/change-password`,
    };

}