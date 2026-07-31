package com.tuneflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SongDTO {

    private Long id;

    private String title;

    private String artist;

    private String album;

    private String genre;

    private Integer duration;

    private String imageUrl;

    private String audioUrl;
}