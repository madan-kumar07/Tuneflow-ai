package com.tuneflow.backend.mapper;

import com.tuneflow.backend.dto.CreateSongRequest;
import com.tuneflow.backend.dto.SongDTO;
import com.tuneflow.backend.dto.SongResponse;
import com.tuneflow.backend.dto.UpdateSongRequest;
import com.tuneflow.backend.entity.Song;

public class SongMapper {

    // Entity -> DTO
    public static SongDTO toDTO(Song song) {
        return SongDTO.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .album(song.getAlbum())
                .genre(song.getGenre())
                .duration(song.getDuration())
                .imageUrl(song.getImageUrl())
                .audioUrl(song.getAudioUrl())
                .build();
    }

    // Entity -> Response
    public static SongResponse toResponse(Song song) {
        return SongResponse.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .album(song.getAlbum())
                .genre(song.getGenre())
                .duration(song.getDuration())
                .imageUrl(song.getImageUrl())
                .audioUrl(song.getAudioUrl())
                .build();
    }

    // Create Request -> Entity
    public static Song toEntity(CreateSongRequest request) {
        return Song.builder()
                .title(request.getTitle())
                .artist(request.getArtist())
                .album(request.getAlbum())
                .genre(request.getGenre())
                .duration(request.getDuration())
                .imageUrl(request.getImageUrl())
                .audioUrl(request.getAudioUrl())
                .build();
    }

    // Update existing Entity
    public static void updateEntity(UpdateSongRequest request, Song song) {
        song.setTitle(request.getTitle());
        song.setArtist(request.getArtist());
        song.setAlbum(request.getAlbum());
        song.setGenre(request.getGenre());
        song.setDuration(request.getDuration());
        song.setImageUrl(request.getImageUrl());
        song.setAudioUrl(request.getAudioUrl());
    }
}