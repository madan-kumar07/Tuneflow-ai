package com.tuneflow.backend.service;

import com.tuneflow.backend.dto.CreateSongRequest;
import com.tuneflow.backend.dto.SongDTO;
import com.tuneflow.backend.dto.SongResponse;
import com.tuneflow.backend.dto.UpdateSongRequest;
import com.tuneflow.backend.entity.Song;
import com.tuneflow.backend.exception.SongNotFoundException;
import com.tuneflow.backend.mapper.SongMapper;
import com.tuneflow.backend.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SongService {

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    // Get all songs
    public List<SongDTO> getAllSongs() {
        return songRepository.findAll()
                .stream()
                .map(SongMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get song by ID
    public SongDTO getSongById(Long id) {

        Song song = songRepository.findById(id)
                .orElseThrow(() -> new SongNotFoundException("Song not found"));

        return SongMapper.toDTO(song);
    }

    // Create new song
    public SongResponse createSong(CreateSongRequest request) {

        Song song = SongMapper.toEntity(request);

        Song savedSong = songRepository.save(song);

        return SongMapper.toResponse(savedSong);
    }

    // Update existing song
    public SongResponse updateSong(Long id, UpdateSongRequest request) {

        Song song = songRepository.findById(id)
                .orElseThrow(() -> new SongNotFoundException("Song not found"));

        SongMapper.updateEntity(request, song);

        Song updatedSong = songRepository.save(song);

        return SongMapper.toResponse(updatedSong);
    }

    // Delete song
    public void deleteSong(Long id) {

        Song song = songRepository.findById(id)
                .orElseThrow(() -> new SongNotFoundException("Song not found"));

        songRepository.delete(song);
    }
}