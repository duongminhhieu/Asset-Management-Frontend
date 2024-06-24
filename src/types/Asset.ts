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
};
