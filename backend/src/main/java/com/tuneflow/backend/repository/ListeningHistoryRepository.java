package com.tuneflow.backend.repository;

import com.tuneflow.backend.entity.ListeningHistory;
import com.tuneflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ListeningHistoryRepository
        extends JpaRepository<ListeningHistory, Long> {

    List<ListeningHistory> findByUserOrderByPlayedAtDesc(User user);

    @Transactional
    void deleteByUser(User user);
}