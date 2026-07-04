package com.wf.challenge.service.adapter.in.dto;

import java.time.Instant;
import java.util.List;

/**
 * Uniform error response body returned by {@code GlobalExceptionHandler}. Hand-written record — the REST edge's wire
 * format for failures.
 *
 * @param timestamp
 *            when the error was produced
 * @param status
 *            HTTP status code
 * @param error
 *            HTTP status reason phrase
 * @param message
 *            human-readable summary
 * @param path
 *            request path that produced the error
 * @param details
 *            optional field-level validation messages (empty when not applicable)
 */
public record ApiError(Instant timestamp, int status, String error, String message, String path, List<String> details) {
}
