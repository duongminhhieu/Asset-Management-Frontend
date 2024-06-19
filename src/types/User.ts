

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
}

export type Location = {
    id: number;
    name: string;
}
