import { Location } from "./Location";

export type User = {
  id: number;
  staffCode: string;
  firstName: string;
  lastName: string;
  username: string;
  joinDate: Date;
  dob: Date;
  gender: string;
  status: string;
  type: string;
  location: Location;
};

export type UserResponse = {
  id: number;
  staffCode: string;
  firstName: string;
  lastName: string;
  username: string;
  joinDate: Date;
  dob: Date;
  gender: string;
  status: string;
  type: string;
  location: Location;
  version: number;
};
