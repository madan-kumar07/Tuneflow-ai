package com.tuneflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSongRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String artist;

    private String album;

    private String genre;

    private Integer duration;

    private String imageUrl;

    private String audioUrl;

    private String videoId;
}