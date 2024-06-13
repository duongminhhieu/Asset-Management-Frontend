import axios from "axios";


const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-type": "application/json",
    },
});

instance.interceptors.request.use(
    // (config) => {
    //   const token = TokenService.getLocalAccessToken();
    //   if (token) {
    //     if (config.data instanceof FormData) {
    //       // eslint-disable-next-line no-param-reassign
    //       config.headers = { ...FORMDATA_HEADER };
    //     }
    //     // eslint-disable-next-line no-param-reassign
    //     config.headers.Authorization = `Bearer ${token}`;
    //   } else {
    //     // eslint-disable-next-line no-param-reassign
    //     delete config.headers.Authorization;
    //   }

    //   return config;
    // },
    // (error) => Promise.reject(error)
);

// let isExpired = false;
instance.interceptors.response.use(
    // (res) => {
    //   isExpired = false;
    //   const { url } = res.config;
    //   if (url === '/users/login') {
    //     TokenService.setUser(res.data);
    //   }
    //   return res;
    // },
    // // eslint-disable-next-line consistent-return
    // (err) => {
    //   if (
    //     (err?.response?.status === 401 && !isExpired) ||
    //     (err?.response?.status === 403 && !isExpired)
    //   ) {
    //     isExpired = true;
    //     if (TokenService.getUser()?.id) {
    //       // eslint-disable-next-line no-alert
    //       alert(i18n.t`error.401.message`);
    //     }
    //     TokenService.removeUser();
    //     window.location = '/login';
    //   } else return Promise.reject(err);
    // }
);

export default instance;
