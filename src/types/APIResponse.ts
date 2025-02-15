export interface APIResponse {
    statusCode: number,
    message: string,
    rediectUrl?: string,
    data?: object
}