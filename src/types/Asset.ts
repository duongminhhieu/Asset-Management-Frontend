import { Location } from "./Location";
import { Category } from "./Category";

export type Asset = {
  id: number;
  name: string;
  specification: string;
  assetCode: string;
  installDate: Date;
  EAssetSate: string;
  category: Category;
  location: Location;
  state:string;
};

export type AssetEdit = {
  id: number;
  name: string;
  specification: string;
  assetCode: string;
  installDate: Date;
  EAssetSate: string;
  category: Category;
  location: Location;
  state: string;
  version: number;
};

export type AssetResponse = {
  id: number;
  name: string;
  specification: string;
  assetCode: string;
  installDate: Date;
  EAssetSate: string;
  category: string;
  location: Location;
  state:string;
};
