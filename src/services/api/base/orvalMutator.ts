import { apiClient, type ApiError } from "@/services/api/base/api-client";

export const customInstance = <T>(config: any, options?: any): Promise<T> => {
  const finalConfig = { ...(config as any), ...(options as any) };
  return apiClient.request<any, T>(finalConfig);
};

export type ErrorType<_Error> = ApiError;
export type BodyType<BodyData> = BodyData;

export function defaultGetNextPageParam<T extends { next_page_url?: string | null }>(lastPage: T) {
  return parseInt(lastPage.next_page_url?.split("page=")[1] || "0") || null;
}

export function infiniteOptions<TQueryFnData = any, TData = TQueryFnData>(options?: any): any {
  return {
    getNextPageParam: defaultGetNextPageParam,
    ...(options ?? {}),
    select: (data: any) => {
      if (data && Array.isArray(data.pages)) {
        return (
          data.pages.flatMap((page: any) => (Array.isArray(page?.data) ? page.data : page)) || []
        );
      }
      return data as TData;
    },
  };
}
