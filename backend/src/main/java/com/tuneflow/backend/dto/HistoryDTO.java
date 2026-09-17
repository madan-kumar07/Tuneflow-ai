package com.tuneflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryDTO {

    private Long id;
    private Long songId;
    private String videoId;
    private String title;
    private String artist;
    private String channel;
    private String thumbnail;
    private String imageUrl;
    private String audioUrl;
    private Integer duration;
    private LocalDateTime playedAt;
}
