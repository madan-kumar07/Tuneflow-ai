package com.tuneflow.backend.repository;

import com.tuneflow.backend.entity.LikedSong;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikedSongRepository extends JpaRepository<LikedSong, Long> {
}