package com.tuneflow.backend.service;

import com.tuneflow.backend.dto.HistoryDTO;
import com.tuneflow.backend.entity.ListeningHistory;
import com.tuneflow.backend.entity.Song;
import com.tuneflow.backend.entity.User;
import com.tuneflow.backend.repository.ListeningHistoryRepository;
import com.tuneflow.backend.repository.SongRepository;
import com.tuneflow.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private final ListeningHistoryRepository historyRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public HistoryService(
            ListeningHistoryRepository historyRepository,
            SongRepository songRepository,
            UserRepository userRepository) {

        this.historyRepository = historyRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    public List<HistoryDTO> getUserHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return historyRepository.findByUserOrderByPlayedAtDesc(user)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public HistoryDTO addToHistory(String email, HistoryDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Song song = null;

        if (dto.getVideoId() != null && !dto.getVideoId().isBlank()) {
            song = songRepository.findByVideoId(dto.getVideoId())
                    .orElseGet(() -> {
                        Song newSong = Song.builder()
                                .videoId(dto.getVideoId())
                                .title(dto.getTitle() != null ? dto.getTitle() : "Unknown Song")
                                .artist(dto.getArtist() != null ? dto.getArtist() : (dto.getChannel() != null ? dto.getChannel() : "Unknown Artist"))
                                .imageUrl(dto.getImageUrl() != null ? dto.getImageUrl() : dto.getThumbnail())
                                .audioUrl(dto.getAudioUrl())
                                .duration(dto.getDuration() != null ? dto.getDuration() : 0)
                                .build();
                        return songRepository.save(newSong);
                    });
        } else if (dto.getSongId() != null) {
            song = songRepository.findById(dto.getSongId())
                    .orElseThrow(() -> new RuntimeException("Song not found"));
        }

        if (song == null) {
            throw new IllegalArgumentException("Song videoId or songId must be provided");
        }

        ListeningHistory history = ListeningHistory.builder()
                .user(user)
                .song(song)
                .build();

        ListeningHistory saved = historyRepository.save(history);

        return toDTO(saved);
    }

    @Transactional
    public void clearUserHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        historyRepository.deleteByUser(user);
    }

    private HistoryDTO toDTO(ListeningHistory history) {
        Song song = history.getSong();
        String img = song.getImageUrl();
        String artistStr = song.getArtist();

        return HistoryDTO.builder()
                .id(history.getId())
                .songId(song.getId())
                .videoId(song.getVideoId())
                .title(song.getTitle())
                .artist(artistStr)
                .channel(artistStr)
                .thumbnail(img)
                .imageUrl(img)
                .audioUrl(song.getAudioUrl())
                .duration(song.getDuration())
                .playedAt(history.getPlayedAt())
                .build();
    }
}
