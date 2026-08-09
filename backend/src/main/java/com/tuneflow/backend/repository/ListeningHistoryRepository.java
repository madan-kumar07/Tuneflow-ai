package com.tuneflow.backend.repository;

import com.tuneflow.backend.entity.ListeningHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListeningHistoryRepository
        extends JpaRepository<ListeningHistory, Long> {
}