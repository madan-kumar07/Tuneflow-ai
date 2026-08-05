package com.tuneflow.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuneflow.backend.dto.YoutubeVideoDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class YoutubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<YoutubeVideoDto> search(String query) throws Exception {

        String url =
                "https://www.googleapis.com/youtube/v3/search"
                        + "?part=snippet"
                        + "&maxResults=10"
                        + "&type=video"
                        + "&q=" + query
                        + "&key=" + apiKey;

        String response = restTemplate.getForObject(url, String.class);

        JsonNode root = mapper.readTree(response);

        List<YoutubeVideoDto> videos = new ArrayList<>();

        JsonNode items = root.get("items");

        if (items == null || !items.isArray()) {
            return videos;
        }

        for (JsonNode item : items) {

            JsonNode snippet = item.get("snippet");
            JsonNode id = item.get("id");

            if (snippet == null || id == null) {
                continue;
            }

            String title = snippet.get("title").asText();
            String channel = snippet.get("channelTitle").asText();

            String thumbnail = "";

            JsonNode thumbnails = snippet.get("thumbnails");

            if (thumbnails != null) {
                if (thumbnails.has("high")) {
                    thumbnail = thumbnails.get("high").get("url").asText();
                } else if (thumbnails.has("medium")) {
                    thumbnail = thumbnails.get("medium").get("url").asText();
                } else if (thumbnails.has("default")) {
                    thumbnail = thumbnails.get("default").get("url").asText();
                }
            }

            String videoId = "";

            if (id.has("videoId")) {
                videoId = id.get("videoId").asText();
            }

            videos.add(new YoutubeVideoDto(
                    title,
                    channel,
                    thumbnail,
                    videoId
            ));
        }

        return videos;
    }
}