package com.tuneflow.backend.controller;

import com.tuneflow.backend.dto.CreateSongRequest;
import com.tuneflow.backend.dto.SongDTO;
import com.tuneflow.backend.dto.SongResponse;
import com.tuneflow.backend.dto.UpdateSongRequest;
import com.tuneflow.backend.service.SongService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin(origins = "*")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    // Get all songs
    @GetMapping
    public List<SongDTO> getAllSongs() {
        return songService.getAllSongs();
    }

    // Get song by ID
    @GetMapping("/{id}")
    public SongDTO getSongById(@PathVariable Long id) {
        return songService.getSongById(id);
    }

    // Create new song
    @PostMapping
    public SongResponse createSong(@Valid @RequestBody CreateSongRequest request) {
        return songService.createSong(request);
    }

    // Update song
    @PutMapping("/{id}")
    public SongResponse updateSong(@PathVariable Long id,
                                   @Valid @RequestBody UpdateSongRequest request) {
        return songService.updateSong(id, request);
    }

    // Delete song
    @DeleteMapping("/{id}")
    public String deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
        return "Song deleted successfully";
    }
}