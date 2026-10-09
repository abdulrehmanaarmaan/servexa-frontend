export interface ApiResponse<T, M = unknown> {
    success: boolean;
    statusCode?: number;
    message: string;
    data: T;
    meta?: M;
    errors?: unknown[];
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedData<T> {
    data: T[];
    meta: PaginationMeta;
}