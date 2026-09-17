package com.tuneflow.backend.controller;

import com.tuneflow.backend.dto.HistoryDTO;
import com.tuneflow.backend.service.HistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<List<HistoryDTO>> getHistory(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        List<HistoryDTO> history = historyService.getUserHistory(authentication.getName());
        return ResponseEntity.ok(history);
    }

    @PostMapping
    public ResponseEntity<HistoryDTO> addToHistory(
            @RequestBody HistoryDTO dto,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        HistoryDTO saved = historyService.addToHistory(authentication.getName(), dto);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping
    public ResponseEntity<?> clearHistory(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        historyService.clearUserHistory(authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Listening history cleared successfully"));
    }
}
