export type UserRequest = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  joinDate: string;
  role: string;
  locationId?: number;
};

export type UserUpdateRequest = {
  dob: string;
  gender: string;
  joinDate: string;
  type: string;
  version: number;
};
