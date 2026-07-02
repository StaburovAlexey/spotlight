export type ApiErrorResponse = {
  success: false;
  error: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};
export type CursorQuery = {
  cursor: string;
  limit: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
