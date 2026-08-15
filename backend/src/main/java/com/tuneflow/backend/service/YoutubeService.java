package com.tuneflow.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuneflow.backend.dto.YoutubeVideoDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class YoutubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public YoutubeService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<YoutubeVideoDto> search(String query) throws Exception {

        List<YoutubeVideoDto> videos = new ArrayList<>();

        // Validate search query
        if (query == null || query.trim().isEmpty()) {
            return videos;
        }

        // Build YouTube API URL safely
        String url = UriComponentsBuilder
                .fromUriString(
                        "https://www.googleapis.com/youtube/v3/search"
                )
                .queryParam("part", "snippet")
                .queryParam("maxResults", 10)
                .queryParam("type", "video")
                .queryParam("q", query.trim())
                .queryParam("key", apiKey)
                .toUriString();

        // Call YouTube API
        String response =
                restTemplate.getForObject(url, String.class);

        if (response == null || response.isBlank()) {
            return videos;
        }

        // Convert JSON response
        JsonNode root =
                objectMapper.readTree(response);

        JsonNode items = root.get("items");

        if (items == null || !items.isArray()) {
            return videos;
        }

        // Convert YouTube results to DTO
        for (JsonNode item : items) {

            JsonNode snippet = item.get("snippet");
            JsonNode id = item.get("id");

            if (snippet == null || id == null) {
                continue;
            }

            // Only process actual videos
            if (!id.has("videoId")) {
                continue;
            }

            String videoId =
                    id.get("videoId").asText();

            if (videoId == null || videoId.isBlank()) {
                continue;
            }

            String title =
                    snippet.has("title")
                            ? snippet.get("title").asText()
                            : "";

            String channel =
                    snippet.has("channelTitle")
                            ? snippet.get("channelTitle").asText()
                            : "";

            // Thumbnail
            String thumbnail = "";

            JsonNode thumbnails =
                    snippet.get("thumbnails");

            if (thumbnails != null) {

                if (thumbnails.has("high")) {

                    thumbnail =
                            thumbnails
                                    .get("high")
                                    .get("url")
                                    .asText();

                } else if (thumbnails.has("medium")) {

                    thumbnail =
                            thumbnails
                                    .get("medium")
                                    .get("url")
                                    .asText();

                } else if (thumbnails.has("default")) {

                    thumbnail =
                            thumbnails
                                    .get("default")
                                    .get("url")
                                    .asText();
                }
            }

            videos.add(
                    new YoutubeVideoDto(
                            title,
                            channel,
                            thumbnail,
                            videoId
                    )
            );
        }

        return videos;
    }
}