package com.tuneflow.backend.repository;

import com.tuneflow.backend.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SongRepository extends JpaRepository<Song, Long> {
    Optional<Song> findByVideoId(String videoId);
}