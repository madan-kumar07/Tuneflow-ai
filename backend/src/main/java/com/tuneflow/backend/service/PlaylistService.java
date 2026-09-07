package com.tuneflow.backend.service;

import com.tuneflow.backend.entity.Playlist;
import com.tuneflow.backend.entity.PlaylistSong;
import com.tuneflow.backend.entity.Song;
import com.tuneflow.backend.entity.User;
import com.tuneflow.backend.repository.PlaylistRepository;
import com.tuneflow.backend.repository.PlaylistSongRepository;
import com.tuneflow.backend.repository.SongRepository;
import com.tuneflow.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public PlaylistService(
            PlaylistRepository playlistRepository,
            PlaylistSongRepository playlistSongRepository,
            SongRepository songRepository,
            UserRepository userRepository) {

        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE PLAYLIST
    // =========================================================

    public Map<String, Object> createPlaylist(
            String email,
            String name,
            String description) {

        String playlistName =
                name == null ? "" : name.trim();

        if (playlistName.isEmpty()) {
            throw new RuntimeException(
                    "Playlist name is required"
            );
        }

        if (playlistName.length() > 100) {
            throw new RuntimeException(
                    "Playlist name must be 100 characters or less"
            );
        }

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Playlist playlist =
                Playlist.builder()
                        .name(playlistName)
                        .description(
                                description == null
                                        ? ""
                                        : description.trim()
                        )
                        .user(user)
                        .build();

        Playlist saved =
                playlistRepository.save(playlist);

        return playlistSummary(saved);
    }

    // =========================================================
    // GET MY PLAYLISTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMyPlaylists(
            String email) {

        return playlistRepository
                .findByUser_EmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::playlistSummary)
                .toList();
    }

    // =========================================================
    // GET ONE PLAYLIST
    // =========================================================

    @Transactional(readOnly = true)
    public Map<String, Object> getPlaylist(
            Long playlistId,
            String email) {

        Playlist playlist =
                getOwnedPlaylist(
                        playlistId,
                        email
                );

        List<PlaylistSong> playlistSongs =
                playlistSongRepository
                        .findByPlaylist_IdOrderByCreatedAtAsc(
                                playlistId
                        );

        return playlistDetails(
                playlist,
                playlistSongs
        );
    }

    // =========================================================
    // RENAME / UPDATE PLAYLIST
    // =========================================================

    public Map<String, Object> updatePlaylist(
            Long playlistId,
            String email,
            String name,
            String description) {

        Playlist playlist =
                getOwnedPlaylist(
                        playlistId,
                        email
                );

        String playlistName =
                name == null ? "" : name.trim();

        if (playlistName.isEmpty()) {
            throw new RuntimeException(
                    "Playlist name is required"
            );
        }

        if (playlistName.length() > 100) {
            throw new RuntimeException(
                    "Playlist name must be 100 characters or less"
            );
        }

        playlist.setName(playlistName);

        playlist.setDescription(
                description == null
                        ? ""
                        : description.trim()
        );

        Playlist saved =
                playlistRepository.save(playlist);

        return playlistSummary(saved);
    }

    // =========================================================
    // DELETE PLAYLIST
    // =========================================================

    @Transactional
    public void deletePlaylist(
            Long playlistId,
            String email) {

        Playlist playlist =
                getOwnedPlaylist(
                        playlistId,
                        email
                );

        playlistRepository.delete(playlist);
    }

    // =========================================================
    // ADD SONG
    // =========================================================

    @Transactional
    public Map<String, Object> addSong(
            Long playlistId,
            Long songId,
            String email) {

        Playlist playlist =
                getOwnedPlaylist(
                        playlistId,
                        email
                );

        Song song =
                songRepository.findById(songId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Song not found"
                                ));

        if (playlistSongRepository
                .existsByPlaylist_IdAndSong_Id(
                        playlistId,
                        songId
                )) {

            throw new RuntimeException(
                    "Song already exists in this playlist"
            );
        }

        PlaylistSong playlistSong =
                PlaylistSong.builder()
                        .playlist(playlist)
                        .song(song)
                        .build();

        playlistSongRepository.save(
                playlistSong
        );

        return songResponse(song);
    }

    // =========================================================
    // REMOVE SONG
    // =========================================================

    @Transactional
    public void removeSong(
            Long playlistId,
            Long songId,
            String email) {

        getOwnedPlaylist(
                playlistId,
                email
        );

        PlaylistSong playlistSong =
                playlistSongRepository
                        .findByPlaylist_IdAndSong_Id(
                                playlistId,
                                songId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Song is not in this playlist"
                                ));

        playlistSongRepository.delete(
                playlistSong
        );
    }

    // =========================================================
    // PRIVATE OWNERSHIP CHECK
    // =========================================================

    private Playlist getOwnedPlaylist(
            Long playlistId,
            String email) {

        return playlistRepository
                .findByIdAndUser_Email(
                        playlistId,
                        email
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Playlist not found"
                        ));
    }

    // =========================================================
    // PLAYLIST SUMMARY
    // =========================================================

    private Map<String, Object> playlistSummary(
            Playlist playlist) {

        long songCount =
                playlistSongRepository
                        .findByPlaylist_IdOrderByCreatedAtAsc(
                                playlist.getId()
                        )
                        .size();

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                playlist.getId()
        );

        response.put(
                "name",
                playlist.getName()
        );

        response.put(
                "description",
                playlist.getDescription()
        );

        response.put(
                "songCount",
                songCount
        );

        response.put(
                "createdAt",
                playlist.getCreatedAt()
        );

        return response;
    }

    // =========================================================
    // PLAYLIST DETAILS
    // =========================================================

    private Map<String, Object> playlistDetails(
            Playlist playlist,
            List<PlaylistSong> playlistSongs) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                playlist.getId()
        );

        response.put(
                "name",
                playlist.getName()
        );

        response.put(
                "description",
                playlist.getDescription()
        );

        response.put(
                "songCount",
                playlistSongs.size()
        );

        response.put(
                "createdAt",
                playlist.getCreatedAt()
        );

        response.put(
                "songs",
                playlistSongs.stream()
                        .map(item ->
                                songResponse(
                                        item.getSong()
                                ))
                        .toList()
        );

        return response;
    }

    // =========================================================
    // SONG RESPONSE
    // =========================================================

    private Map<String, Object> songResponse(
            Song song) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                song.getId()
        );

        response.put(
                "title",
                song.getTitle()
        );

        response.put(
                "artist",
                song.getArtist()
        );

        response.put(
                "album",
                song.getAlbum()
        );

        response.put(
                "genre",
                song.getGenre()
        );

        response.put(
                "duration",
                song.getDuration()
        );

        response.put(
                "imageUrl",
                song.getImageUrl()
        );

        response.put(
                "audioUrl",
                song.getAudioUrl()
        );

        response.put(
                "videoId",
                song.getVideoId()
        );

        return response;
    }
}