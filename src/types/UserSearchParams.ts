type UserSearchParams = {
  searchString: string;
  type: string;
  orderBy?: string | undefined;
  sortDir?: string | undefined;
  pageNumber: number;
  pageSize: number;
};

export default UserSearchParams;
