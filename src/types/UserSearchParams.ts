type UserSearchParams = {
  searchString: string;
  type: string;
  orderBy?: string | null | undefined;
  sortDir?: string | null | undefined;
  pageNumber: number;
  pageSize: number;
};

export default UserSearchParams;
