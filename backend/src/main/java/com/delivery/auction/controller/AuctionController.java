package com.delivery.auction.controller;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.service.AuctionService;
import com.delivery.bid.dto.BidDto;
import com.delivery.bid.service.BidService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionService auctionService;
    private final BidService bidService;

    public AuctionController(AuctionService auctionService, BidService bidService) {
        this.auctionService = auctionService;
        this.bidService = bidService;
    }

    @PostMapping
    public ResponseEntity<AuctionDto> createAuction(@Validated @RequestBody AuctionDto dto) {
        AuctionDto created = auctionService.createAuction(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionDto> getAuction(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getAuction(id));
    }

    @GetMapping
    public ResponseEntity<List<AuctionDto>> listAuctions() {
        return ResponseEntity.ok(auctionService.listAuctions());
    }

    @GetMapping("/{auctionId}/bids")
    public ResponseEntity<List<BidDto>> getBidsByAuction(@PathVariable Long auctionId) {
        List<BidDto> bids = bidService.getBidsByAuction(auctionId);
        return ResponseEntity.ok(bids);
    }

    @GetMapping("/{auctionId}/highest")
    public ResponseEntity<BidDto> getHighestBid(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getHighestBid(auctionId).orElse(null));
    }

    @GetMapping("/{auctionId}/leaderboard")
    public ResponseEntity<List<BidDto>> getLeaderboardByAuction(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getLeaderboardByAuction(auctionId));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<BidDto>> getGlobalLeaderboard() {
        return ResponseEntity.ok(bidService.getGlobalLeaderboard());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuctionDto> updateAuction(@PathVariable Long id,
            @Validated @RequestBody AuctionDto dto) {
        return ResponseEntity.ok(auctionService.updateAuction(id, dto));
    }
}
