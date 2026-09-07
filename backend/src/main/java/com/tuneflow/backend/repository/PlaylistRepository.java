package com.tuneflow.backend.repository;

import com.tuneflow.backend.entity.Playlist;
import com.tuneflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    // Get user's playlists
    List<Playlist> findByUser(User user);

    // Get user's playlists ordered by newest first
    List<Playlist> findByUserOrderByCreatedAtDesc(User user);

    // Get playlists using user's email
    List<Playlist> findByUser_EmailOrderByCreatedAtDesc(String email);

    // Find a specific playlist belonging to a user
    Optional<Playlist> findByIdAndUser_Email(Long id, String email);
}