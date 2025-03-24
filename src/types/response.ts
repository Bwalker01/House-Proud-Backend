import { AppError } from "./error";

export interface StandardResponse {
    success: Boolean,
    message: string,
    data: object | object[],
    errors: AppError[]
}