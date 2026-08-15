package com.tuneflow.backend.repository;

import com.tuneflow.backend.entity.LikedSong;
import com.tuneflow.backend.entity.Song;
import com.tuneflow.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikedSongRepository
        extends JpaRepository<LikedSong, Long> {

    Optional<LikedSong> findByUserAndSong(
            User user,
            Song song
    );

    boolean existsByUserAndSong(
            User user,
            Song song
    );

    List<LikedSong> findByUserOrderByCreatedAtDesc(
            User user
    );
}