package com.tuneflow.backend.exception;

import com.tuneflow.backend.dto.ApiErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Validation Errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        ApiErrorResponse response = ApiErrorResponse.builder()
                .success(false)
                .message("Validation Failed")
                .timestamp(LocalDateTime.now())
                .errors(errors)
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Song Not Found
    @ExceptionHandler(SongNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleSongNotFoundException(
            SongNotFoundException ex) {

        ApiErrorResponse response = ApiErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .errors(null)
                .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Bad Credentials (Login failure)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex) {

        ApiErrorResponse response = ApiErrorResponse.builder()
                .success(false)
                .message("Invalid email or password")
                .timestamp(LocalDateTime.now())
                .errors(null)
                .build();

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // Runtime & Business Exceptions (Auth, OTP, Resend, Validation)
    @ExceptionHandler({RuntimeException.class, IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiErrorResponse> handleBusinessException(Exception ex) {

        String msg = ex.getMessage() != null ? ex.getMessage() : "Request processing failed";
        HttpStatus status = HttpStatus.BAD_REQUEST;

        if (msg.toLowerCase().contains("already exists")) {
            status = HttpStatus.CONFLICT;
        } else if (msg.toLowerCase().contains("wait") || msg.toLowerCase().contains("cooldown")) {
            status = HttpStatus.TOO_MANY_REQUESTS;
        } else if (msg.toLowerCase().contains("unauthorized") || msg.toLowerCase().contains("bad credentials")) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (msg.toLowerCase().contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        }

        ApiErrorResponse response = ApiErrorResponse.builder()
                .success(false)
                .message(msg)
                .timestamp(LocalDateTime.now())
                .errors(null)
                .build();

        return new ResponseEntity<>(response, status);
    }

    // Generic Fallback Exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex) {

        log.error("Unhandled exception occurred: ", ex);

        ApiErrorResponse response = ApiErrorResponse.builder()
                .success(false)
                .message("An unexpected server error occurred. Please try again.")
                .timestamp(LocalDateTime.now())
                .errors(null)
                .build();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}