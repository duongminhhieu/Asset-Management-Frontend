export class APIConstants {
  static AUTH = {
    LOGIN: "/auth/login",
  };

  static USER = {
    GET_USERS: "/users",
    GET_USER_ASSIGN: "/users/assign",
    UPDATE_USER: "/user",
    CREATE_USER: "/users",
    GENERATE_USERNAME: "/users/generate-username",
    FIRST_CHANGE_PASSWORD: `/users/first-change-password`,
    CHANGE_PASSWORD: `/users/change-password`,
  };

  static LOCATION = {
    GET_ALL_LOCATIONS: "/locations",
    CREATE_LOCATION: "/locations",
  };

  static CATEGORY = {
    GET_ALL_CATEGORIES: "/categories",
    CREATE_CATEGORY: "/categories",
  };
  static ASSET = {
    CREATE_ASSET: "/assets",
    GET_ASSETS: "/assets",
    DELETE_ASSET: (id: number) => `/assets/${id}`,
    GET_ASSET_HISTORY: (id: number) => `assets/exist-assignments/${id}`,
  };

  static ASSIGNMENT = {
    HISTORY: (assetId: number) => `/assignments/${assetId}/history`,
    CREATE_ASSIGNMENT: "/assignments",
    GET_ASSIGNMENTS: "/assignments",
    DELETE_ASSIGNMENT: (id: number) => `/assignments/${id}`,
    GET_ASSIGNMENT: (assignmentId: number) => `/assignments/${assignmentId}`,
    UPDATE_ASSIGNMENT: (assignmentId: number) => `/assignments/${assignmentId}`,
  };
}
