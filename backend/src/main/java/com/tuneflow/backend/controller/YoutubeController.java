package com.tuneflow.backend.controller;

import com.tuneflow.backend.dto.YoutubeVideoDto;
import com.tuneflow.backend.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/youtube")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class YoutubeController {

    private final YoutubeService youtubeService;

    @GetMapping("/search")
    public List<YoutubeVideoDto> search(
            @RequestParam String query) throws Exception {

        return youtubeService.search(query);
    }
}