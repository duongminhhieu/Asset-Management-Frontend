type AssetSearchParams = {
    searchString: string;
    states: string;
    assignDate: string | null;
    orderBy?: string | undefined;
    sortDir?: string | undefined;
    pageNumber: number;
    pageSize: number;
  };
  
  export default AssetSearchParams;