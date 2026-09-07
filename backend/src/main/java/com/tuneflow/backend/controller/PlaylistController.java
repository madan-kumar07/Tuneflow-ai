package com.tuneflow.backend.controller;

import com.tuneflow.backend.service.PlaylistService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "*")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(
            PlaylistService playlistService) {

        this.playlistService = playlistService;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createPlaylist(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                playlistService.createPlaylist(
                        email,
                        request.get("name"),
                        request.get("description")
                )
        );
    }

    // =========================================================
    // GET MY PLAYLISTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>>
    getMyPlaylists(
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                playlistService.getMyPlaylists(
                        email
                )
        );
    }

    // =========================================================
    // GET PLAYLIST DETAILS
    // =========================================================

    @GetMapping("/{playlistId}")
    public ResponseEntity<?> getPlaylist(
            @PathVariable Long playlistId,
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                playlistService.getPlaylist(
                        playlistId,
                        email
                )
        );
    }

    // =========================================================
    // UPDATE PLAYLIST
    // =========================================================

    @PutMapping("/{playlistId}")
    public ResponseEntity<?> updatePlaylist(
            @PathVariable Long playlistId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                playlistService.updatePlaylist(
                        playlistId,
                        email,
                        request.get("name"),
                        request.get("description")
                )
        );
    }

    // =========================================================
    // DELETE PLAYLIST
    // =========================================================

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<?> deletePlaylist(
            @PathVariable Long playlistId,
            Authentication authentication) {

        String email =
                authentication.getName();

        playlistService.deletePlaylist(
                playlistId,
                email
        );

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message",
                        "Playlist deleted successfully"
                )
        );
    }

    // =========================================================
    // ADD SONG
    // =========================================================

    @PostMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<?> addSong(
            @PathVariable Long playlistId,
            @PathVariable Long songId,
            Authentication authentication) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                playlistService.addSong(
                        playlistId,
                        songId,
                        email
                )
        );
    }

    // =========================================================
    // REMOVE SONG
    // =========================================================

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<?> removeSong(
            @PathVariable Long playlistId,
            @PathVariable Long songId,
            Authentication authentication) {

        String email =
                authentication.getName();

        playlistService.removeSong(
                playlistId,
                songId,
                email
        );

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message",
                        "Song removed from playlist"
                )
        );
    }
}