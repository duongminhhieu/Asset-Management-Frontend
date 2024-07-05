
export type Report = {
    categoryId: number;
    categoryName: string;
    total: number;
    assignedCount: number;
    availableCount: number;
    notAvailableCount: number;
    waitingForRecycleCount: number;
    recycledCount: number;
}

export type ReportSearchParams = {
    pageNumber: number;
    pageSize: number;
    sortBy?: string;
    sortDir?: string;
}