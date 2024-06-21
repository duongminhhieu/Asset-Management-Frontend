export class APIConstants {
  static AUTH = {
    LOGIN: "/auth/login",
  };

  static USER = {
    GET_USERS: "/users",
    UPDATE_USER: "/user",
    FIRST_CHANGE_PASSWORD: `/users/first-change-password`,
    CHANGE_PASSWORD: `/users/change-password`,
  };

  static CATEGORY = {
    GET_ALL_CATEGORIES: "/categories",
    CREATE_CATEGORY: "/categories",
  };

  static ASSET = {
    CREATE_ASSET: "/assets",
  };
}
