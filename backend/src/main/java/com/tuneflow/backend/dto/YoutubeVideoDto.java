package com.tuneflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YoutubeVideoDto {

    private String title;
    private String channel;
    private String thumbnail;
    private String videoId;
}