export interface APIResponse {
    statusCode: number,
    message: string,
    redirectUrl?: string,
    data?: object
}