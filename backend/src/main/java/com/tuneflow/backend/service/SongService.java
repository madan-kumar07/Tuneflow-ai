package com.tuneflow.backend.service;

import com.tuneflow.backend.dto.CreateSongRequest;
import com.tuneflow.backend.dto.SongDTO;
import com.tuneflow.backend.dto.SongResponse;
import com.tuneflow.backend.dto.UpdateSongRequest;
import com.tuneflow.backend.entity.LikedSong;
import com.tuneflow.backend.entity.Song;
import com.tuneflow.backend.entity.User;
import com.tuneflow.backend.exception.SongNotFoundException;
import com.tuneflow.backend.mapper.SongMapper;
import com.tuneflow.backend.repository.LikedSongRepository;
import com.tuneflow.backend.repository.SongRepository;
import com.tuneflow.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final LikedSongRepository likedSongRepository;
    private final UserRepository userRepository;

    public SongService(
            SongRepository songRepository,
            LikedSongRepository likedSongRepository,
            UserRepository userRepository) {

        this.songRepository = songRepository;
        this.likedSongRepository = likedSongRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL SONGS
    // =========================================================

    public List<SongDTO> getAllSongs() {

        return songRepository.findAll()
                .stream()
                .map(SongMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET SONG BY ID
    // =========================================================

    public SongDTO getSongById(Long id) {

        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                        new SongNotFoundException("Song not found"));

        return SongMapper.toDTO(song);
    }

    // =========================================================
    // CREATE SONG
    // =========================================================

    public SongResponse createSong(CreateSongRequest request) {

        Song song = SongMapper.toEntity(request);

        Song savedSong = songRepository.save(song);

        return SongMapper.toResponse(savedSong);
    }

    // =========================================================
    // UPDATE SONG
    // =========================================================

    public SongResponse updateSong(
            Long id,
            UpdateSongRequest request) {

        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                        new SongNotFoundException("Song not found"));

        SongMapper.updateEntity(request, song);

        Song updatedSong = songRepository.save(song);

        return SongMapper.toResponse(updatedSong);
    }

    // =========================================================
    // DELETE SONG
    // =========================================================

    public void deleteSong(Long id) {

        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                        new SongNotFoundException("Song not found"));

        songRepository.delete(song);
    }

    // =========================================================
    // LIKE SONG
    // =========================================================

    public String likeSong(
            Long songId,
            String email) {

        // Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Find song
        Song song = songRepository.findById(songId)
                .orElseThrow(() ->
                        new SongNotFoundException("Song not found"));

        // Check whether already liked
        if (likedSongRepository.existsByUserAndSong(user, song)) {
            return "Song already liked";
        }

        // Create liked-song relationship
        LikedSong likedSong = LikedSong.builder()
                .user(user)
                .song(song)
                .build();

        // Save relationship
        likedSongRepository.save(likedSong);

        return "Song liked successfully";
    }

    // =========================================================
    // UNLIKE SONG
    // =========================================================

    @Transactional
    public String unlikeSong(
            Long songId,
            String email) {

        // Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Find song
        Song song = songRepository.findById(songId)
                .orElseThrow(() ->
                        new SongNotFoundException("Song not found"));

        // Find the actual liked-song record
        LikedSong likedSong = likedSongRepository
                .findByUserAndSong(user, song)
                .orElseThrow(() ->
                        new RuntimeException("Song is not liked"));

        // Delete the relationship
        likedSongRepository.delete(likedSong);

        return "Song unliked successfully";
    }

    // =========================================================
    // GET LIKED SONGS
    // =========================================================

    public List<SongDTO> getLikedSongs(
            String email) {

        // Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Get liked songs of this user
        return likedSongRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(LikedSong::getSong)
                .map(SongMapper::toDTO)
                .collect(Collectors.toList());
    }
}