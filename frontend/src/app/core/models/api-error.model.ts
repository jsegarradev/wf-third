/**
 * Normalized error shape shared across the app. Mirrors the backend `ApiError` record; the error interceptor maps every
 * failed HTTP call into this so components handle one consistent type.
 */
export interface ApiError {
    readonly status: number
    readonly error: string
    readonly message: string
    readonly path: string
    readonly details: readonly string[]
    readonly timestamp: string
}
