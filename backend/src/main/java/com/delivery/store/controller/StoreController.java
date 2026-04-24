package com.delivery.store.controller;

import com.delivery.auth.AuthResponse;
import com.delivery.auth.JwtUtil;
import com.delivery.bid.dto.BidDto;
import com.delivery.bid.service.BidService;
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
    private final BidService bidService;
    private final JwtUtil jwtUtil;

    public StoreController(StoreService storeService, BidService bidService, JwtUtil jwtUtil) {
        this.storeService = storeService;
        this.bidService = bidService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<StoreDto> createStore(@Validated @RequestBody StoreDto dto) {
        StoreDto created = storeService.createStore(dto);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody StoreDto dto) {
        StoreDto store = storeService.login(dto.getName(), dto.getPassword());
        String token = jwtUtil.generate(String.valueOf(store.getId()));
        return ResponseEntity.ok(new AuthResponse(token, store));
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

    @GetMapping("/{id}/whale-pass/price")
    public ResponseEntity<java.util.Map<String, Object>> whalePassPrice(@PathVariable Long id) {
        com.delivery.store.entity.Store store = storeService.getRawStore(id);
        java.math.BigDecimal price = storeService.whalePassPrice(store);
        boolean discounted = price.compareTo(new java.math.BigDecimal("150")) == 0;
        return ResponseEntity.ok(java.util.Map.of("price", price, "discounted", discounted));
    }

    @PostMapping("/{id}/whale-pass")
    public ResponseEntity<StoreDto> activateWhalePass(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.activateWhalePass(id));
    }

    @DeleteMapping("/{id}/whale-pass")
    public ResponseEntity<StoreDto> deactivateWhalePass(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.deactivateWhalePass(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
}
