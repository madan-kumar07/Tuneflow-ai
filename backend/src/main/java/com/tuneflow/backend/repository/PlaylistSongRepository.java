package com.tuneflow.backend.repository;

import com.tuneflow.backend.entity.PlaylistSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistSongRepository
        extends JpaRepository<PlaylistSong, Long> {

    List<PlaylistSong> findByPlaylist_IdOrderByCreatedAtAsc(
            Long playlistId
    );

    Optional<PlaylistSong> findByPlaylist_IdAndSong_Id(
            Long playlistId,
            Long songId
    );

    boolean existsByPlaylist_IdAndSong_Id(
            Long playlistId,
            Long songId
    );

    void deleteByPlaylist_IdAndSong_Id(
            Long playlistId,
            Long songId
    );

    void deleteByPlaylist_Id(
            Long playlistId
    );
}