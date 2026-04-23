package com.delivery.auction.controller;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.service.AuctionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionService auctionService;

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
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

    @PutMapping("/{id}")
    public ResponseEntity<AuctionDto> updateAuction(@PathVariable Long id,
                                                    @Validated @RequestBody AuctionDto dto) {
        return ResponseEntity.ok(auctionService.updateAuction(id, dto));
    }
}
