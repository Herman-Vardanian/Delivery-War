package com.delivery.store.controller;

import com.delivery.store.dto.StoreDto;
import com.delivery.store.service.StoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @PostMapping
    public ResponseEntity<StoreDto> createStore(@Validated @RequestBody StoreDto dto) {
        StoreDto created = storeService.createStore(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStore(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStore(id));
    }

    @GetMapping
    public ResponseEntity<List<StoreDto>> listStores() {
        return ResponseEntity.ok(storeService.listStores());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreDto> updateStore(@PathVariable Long id, @RequestBody StoreDto dto) {
        return ResponseEntity.ok(storeService.updateStore(id, dto));
    }
}
