package com.delivery.bid.controller;

import com.delivery.bid.dto.BidDto;
import com.delivery.bid.service.BidService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping
    public ResponseEntity<BidDto> createBid(@Validated @RequestBody BidDto dto) {
        BidDto created = bidService.createBid(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BidDto> getBid(@PathVariable Long id) {
        return ResponseEntity.ok(bidService.getBid(id));
    }

    @GetMapping
    public ResponseEntity<List<BidDto>> listBids() {
        return ResponseEntity.ok(bidService.listBids());
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<BidDto>> getBidsByAuction(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getBidsByAuction(auctionId));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BidDto>> getBidsByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(bidService.getBidsByStore(storeId));
    }

    @GetMapping("/auction/{auctionId}/highest")
    public ResponseEntity<?> getHighestBid(@PathVariable Long auctionId) {
        Optional<BidDto> highest = bidService.getHighestBid(auctionId);
        return highest.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
