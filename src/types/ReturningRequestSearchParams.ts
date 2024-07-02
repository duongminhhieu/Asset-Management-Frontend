type ReturningRequestSearchParams = {
    searchString: string;
    states: string;
    returnDate: string | null;
    orderBy?: string | undefined;
    sortDir?: string | undefined;
    pageNumber: number;
    pageSize: number;
  };
  
  export default ReturningRequestSearchParams;