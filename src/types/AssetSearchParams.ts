type AssetSearchParams = {
  searchString: string;
  states: string;
  categoryIds: string;
  orderBy?: string | undefined;
  sortDir?: string | undefined;
  pageNumber: number;
  pageSize: number;
};

export default AssetSearchParams;
