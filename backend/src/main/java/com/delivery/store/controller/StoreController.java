package com.delivery.store.controller;

import com.delivery.bid.dto.BidDto;
import com.delivery.bid.service.BidService;
import com.delivery.store.dto.StoreDto;
import com.delivery.store.service.StoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;
    private final BidService bidService;

    public StoreController(StoreService storeService, BidService bidService) {
        this.storeService = storeService;
        this.bidService = bidService;
    }

    @PostMapping
    public ResponseEntity<StoreDto> createStore(@Validated @RequestBody StoreDto dto) {
        StoreDto created = storeService.createStore(dto);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<StoreDto> login(@RequestBody StoreDto dto) {
        return ResponseEntity.ok(storeService.login(dto.getName(), dto.getPassword()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStore(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStore(id));
    }

    @GetMapping
    public ResponseEntity<List<StoreDto>> listStores() {
        return ResponseEntity.ok(storeService.listStores());
    }

    @GetMapping("/{storeId}/bid")
    public ResponseEntity<List<BidDto>> getBidsByStore(@PathVariable Long storeId) {
        List<BidDto> bids = bidService.getBidsByStore(storeId);
        return ResponseEntity.ok(bids);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreDto> updateStore(@PathVariable Long id, @RequestBody StoreDto dto) {
        return ResponseEntity.ok(storeService.updateStore(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
}
