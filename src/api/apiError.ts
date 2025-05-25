export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly originalError?: Error;

  constructor(
    messageOrError: string | Error,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
  ) {
    // If messageOrError is an Error, use its message and store the original error
    const message =
      messageOrError instanceof Error ? messageOrError.message : messageOrError;
    super(message);

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);

    this.statusCode = statusCode;
    this.code = code;
    this.originalError =
      messageOrError instanceof Error ? messageOrError : undefined;

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // Common error types as static methods for easy creation
  static badRequest(message: string | Error): ApiError {
    return new ApiError(message, 400, 'BAD_REQUEST');
  }

  static unauthorized(message: string | Error): ApiError {
    return new ApiError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message: string | Error): ApiError {
    return new ApiError(message, 403, 'FORBIDDEN');
  }

  static notFound(message: string | Error): ApiError {
    return new ApiError(message, 404, 'NOT_FOUND');
  }

  static conflict(message: string | Error): ApiError {
    return new ApiError(message, 409, 'CONFLICT');
  }

  static internal(message: string | Error): ApiError {
    return new ApiError(message, 500, 'INTERNAL_SERVER_ERROR');
  }

  // Convert to a plain object for API responses
  toJSON() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}
