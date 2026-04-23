package com.delivery.bid.service;

import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.bid.dto.BidDto;
import com.delivery.bid.entity.Bid;
import com.delivery.bid.entity.BidStatus;
import com.delivery.bid.mapper.BidMapper;
import com.delivery.bid.repository.BidRepository;
import com.delivery.store.entity.Store;
import com.delivery.store.repository.StoreRepository;
import com.delivery.auction.entity.Auction;
import com.delivery.auction.repository.AuctionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BidService {

    private final BidRepository repository;
    private final StoreRepository storeRepository;
    private final AuctionRepository auctionRepository;
    private final BidMapper mapper;

    public BidService(BidRepository repository, StoreRepository storeRepository, 
                      AuctionRepository auctionRepository, BidMapper mapper) {
        this.repository = repository;
        this.storeRepository = storeRepository;
        this.auctionRepository = auctionRepository;
        this.mapper = mapper;
    }

    public BidDto createBid(BidDto dto) {
        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + dto.getStoreId()));
        
        Auction auction = auctionRepository.findById(dto.getAuctionId())
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found: " + dto.getAuctionId()));
        
        Bid bid = mapper.toEntity(dto);
        bid.setStore(store);
        bid.setAuction(auction);
        bid.setTimestamp(LocalDateTime.now());
        bid.setStatus(BidStatus.OUTBID);
        
        Bid saved = repository.save(bid);
        return mapper.toDto(saved);
    }

    public BidDto getBid(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found: " + id));
    }

    public List<BidDto> listBids() {
        return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public List<BidDto> getBidsByAuction(Long auctionId) {
        // Verify auction exists first
        if (!auctionRepository.existsById(auctionId)) {
            throw new ResourceNotFoundException("Auction not found: " + auctionId);
        }
        
        List<Bid> bids = repository.findBidsByAuctionIdOrderByAmountDesc(auctionId);
        return mapper.toDtoList(bids);
    }

    public List<BidDto> getBidsByStore(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + storeId));
        
        List<Bid> bids = repository.findByStore(store);
        return mapper.toDtoList(bids);
    }

    public Optional<BidDto> getHighestBid(Long auctionId) {
        // Verify auction exists first
        if (!auctionRepository.existsById(auctionId)) {
            throw new ResourceNotFoundException("Auction not found: " + auctionId);
        }
        
        return repository.findTopByAuctionIdOrderByAmountDesc(auctionId)
                .map(mapper::toDto);
    }
}
