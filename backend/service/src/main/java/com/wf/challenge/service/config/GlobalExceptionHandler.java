package com.wf.challenge.service.config;

import com.wf.challenge.service.adapter.in.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Translates uncaught exceptions into a uniform {@link ApiError} body with the correct HTTP status. Controllers stay
 * thin; error shaping lives here.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * {@code @Valid} body binding failures → 400 with per-field messages.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(final MethodArgumentNotValidException ex,
            final HttpServletRequest request) {
        final List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(GlobalExceptionHandler::formatFieldError).toList();
        return build(HttpStatus.BAD_REQUEST, "Validation failed", request, details);
    }

    /**
     * Constraint violations on query/path params → 400.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolation(final ConstraintViolationException ex,
            final HttpServletRequest request) {
        final List<String> details = ex.getConstraintViolations().stream().map(GlobalExceptionHandler::formatViolation)
                .toList();
        return build(HttpStatus.BAD_REQUEST, "Validation failed", request, details);
    }

    /**
     * Missing entity lookups → 404.
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiError> handleNotFound(final NoSuchElementException ex, final HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request, List.of());
    }

    /**
     * Illegal arguments (e.g. domain precondition failures) → 400.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(final IllegalArgumentException ex,
            final HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request, List.of());
    }

    /**
     * Anything unmapped → 500 (last-resort guard).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(final Exception ex, final HttpServletRequest request) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error", request, List.of());
    }

    private static ResponseEntity<ApiError> build(final HttpStatus status, final String message,
            final HttpServletRequest request, final List<String> details) {
        final ApiError body = new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message,
                request.getRequestURI(), details);
        return ResponseEntity.status(status).body(body);
    }

    private static String formatFieldError(final FieldError error) {
        return error.getField() + ": " + error.getDefaultMessage();
    }

    private static String formatViolation(final ConstraintViolation<?> violation) {
        return violation.getPropertyPath() + ": " + violation.getMessage();
    }

}
