export type Asset = {
    id: number,
    name: string;
    specification: string;
    assetCode: string;
    installDate: Date;
    state: string;
    location: Location;
    category: string;
}

export type Location = {
    id: number;
    name: string;
    code: string;
}