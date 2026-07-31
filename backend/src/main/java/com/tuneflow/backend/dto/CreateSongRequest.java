package com.tuneflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSongRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @NotBlank(message = "Artist is required")
    @Size(max = 100, message = "Artist cannot exceed 100 characters")
    private String artist;

    @Size(max = 100, message = "Album cannot exceed 100 characters")
    private String album;

    @Size(max = 50, message = "Genre cannot exceed 50 characters")
    private String genre;

    @Positive(message = "Duration must be greater than 0")
    private Integer duration;

    private String imageUrl;

    private String audioUrl;
}