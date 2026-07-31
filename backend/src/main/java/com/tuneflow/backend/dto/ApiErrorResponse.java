package com.tuneflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class ApiErrorResponse {

    private boolean success;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> errors;

}