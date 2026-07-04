import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../models/api-error.model';

const CLIENT_ERROR_STATUS = 0;
const UNKNOWN_ERROR_MESSAGE = 'An unexpected error occurred';

/**
 * Functional HTTP interceptor that normalizes every failed response into the shared {@link ApiError} shape, so callers
 * always handle one consistent error type regardless of whether the failure came from the server or the client.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((response: HttpErrorResponse) => {
            return throwError(() => toApiError(response, req.url));
        }),
    );
};

function toApiError(response: HttpErrorResponse, path: string): ApiError {
    const body: Partial<ApiError> | null = isApiError(response.error) ? response.error : null;
    return {
        status: body?.status ?? response.status ?? CLIENT_ERROR_STATUS,
        error: body?.error ?? response.statusText ?? 'Error',
        message: body?.message ?? response.message ?? UNKNOWN_ERROR_MESSAGE,
        path: body?.path ?? path,
        details: body?.details ?? [],
        timestamp: body?.timestamp ?? new Date().toISOString(),
    };
}

function isApiError(value: unknown): value is Partial<ApiError> {
    return typeof value === 'object' && value !== null && 'message' in value;
}
