package com.delivery.leaderboard.controller;

import com.delivery.store.dto.StoreDto;
import com.delivery.store.service.StoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final StoreService storeService;

    public LeaderboardController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping
    public ResponseEntity<List<StoreDto>> getLeaderboard() {
        return ResponseEntity.ok(storeService.getStoreLeaderboard());
    }
}