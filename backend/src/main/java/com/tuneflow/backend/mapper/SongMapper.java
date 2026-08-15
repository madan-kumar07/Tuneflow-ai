package com.tuneflow.backend.mapper;

import com.tuneflow.backend.dto.CreateSongRequest;
import com.tuneflow.backend.dto.SongDTO;
import com.tuneflow.backend.dto.SongResponse;
import com.tuneflow.backend.dto.UpdateSongRequest;
import com.tuneflow.backend.entity.Song;

public class SongMapper {

    private SongMapper() {
    }

    public static SongDTO toDTO(Song song) {

        return new SongDTO(
                song.getId(),
                song.getTitle(),
                song.getArtist(),
                song.getAlbum(),
                song.getGenre(),
                song.getDuration(),
                song.getImageUrl(),
                song.getAudioUrl(),
                song.getVideoId()
        );
    }

    public static Song toEntity(CreateSongRequest request) {

        return Song.builder()
                .title(request.getTitle())
                .artist(request.getArtist())
                .album(request.getAlbum())
                .genre(request.getGenre())
                .duration(request.getDuration())
                .imageUrl(request.getImageUrl())
                .audioUrl(request.getAudioUrl())
                .videoId(request.getVideoId())
                .build();
    }

    public static void updateEntity(
            UpdateSongRequest request,
            Song song) {

        if (request.getTitle() != null) {
            song.setTitle(request.getTitle());
        }

        if (request.getArtist() != null) {
            song.setArtist(request.getArtist());
        }

        if (request.getAlbum() != null) {
            song.setAlbum(request.getAlbum());
        }

        if (request.getGenre() != null) {
            song.setGenre(request.getGenre());
        }

        if (request.getDuration() != null) {
            song.setDuration(request.getDuration());
        }

        if (request.getImageUrl() != null) {
            song.setImageUrl(request.getImageUrl());
        }

        if (request.getAudioUrl() != null) {
            song.setAudioUrl(request.getAudioUrl());
        }

        if (request.getVideoId() != null) {
            song.setVideoId(request.getVideoId());
        }
    }

    public static SongResponse toResponse(Song song) {

        return new SongResponse(
                song.getId(),
                song.getTitle(),
                song.getArtist(),
                song.getAlbum(),
                song.getGenre(),
                song.getDuration(),
                song.getImageUrl(),
                song.getAudioUrl(),
                song.getVideoId()
        );
    }
}