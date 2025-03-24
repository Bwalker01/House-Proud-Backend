export interface AppError {
    context: string,
    message: string,
    cause?: string,
    error?: Error,
}