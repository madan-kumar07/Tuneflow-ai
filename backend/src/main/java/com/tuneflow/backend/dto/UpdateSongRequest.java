package com.tuneflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSongRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String artist;

    private String album;

    private String genre;

    @NotNull
    private Integer duration;

    private String imageUrl;

    private String audioUrl;

    private String videoId;
}