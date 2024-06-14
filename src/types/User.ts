
export type User = {
    id: number;
    firstName: string;
    lastName: string;
    dob: Date;
    gender: string;
    joinDate: Date;
    role: Role;
    location: string;
}

export type Role = {
    name: string;
}
