type ApiResponse<T> = {
    status: number;
    success: boolean;
    message: string;
    data: T | null;
};

export function successResponse<T = any>(
    message: string,
    data: T | null = null,
    status = 200,
): ApiResponse<T> {
    return {
        status,
        success: true,
        message,
        data,
    };
}
