package com.delivery.bid.service;

import com.delivery.common.exception.InsufficientBalanceException;
import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.bid.dto.BidDto;
import com.delivery.bid.entity.Bid;
import com.delivery.bid.entity.BidStatus;
import com.delivery.bid.mapper.BidMapper;
import com.delivery.bid.repository.BidRepository;
import com.delivery.store.entity.Store;
import com.delivery.store.repository.StoreRepository;
import com.delivery.auction.entity.Auction;
import com.delivery.auction.entity.AuctionStatus;
import com.delivery.auction.repository.AuctionRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BidService {

    private final BidRepository repository;
    private final StoreRepository storeRepository;
    private final AuctionRepository auctionRepository;
    private final BidMapper mapper;
    private final SimpMessagingTemplate messagingTemplate;

    public BidService(BidRepository repository, StoreRepository storeRepository,
            AuctionRepository auctionRepository, BidMapper mapper,
            SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.storeRepository = storeRepository;
        this.auctionRepository = auctionRepository;
        this.mapper = mapper;
        this.messagingTemplate = messagingTemplate;
    }

    public BidDto createBid(BidDto dto) {

        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Magasin non trouvé: " + dto.getStoreId()));

        Auction auction = auctionRepository.findById(dto.getAuctionId())
                .orElseThrow(() -> new ResourceNotFoundException("Enchère non trouvée: " + dto.getAuctionId()));

        if (auction.getStatus() != AuctionStatus.OPEN) {
            throw new IllegalStateException("L'enchère n'est pas ouverte");
        }

        if (Boolean.TRUE.equals(auction.getWhaleOnly()) && !Boolean.TRUE.equals(store.getWhalePass())) {
            throw new IllegalStateException("Cette enchère est réservée aux détenteurs du Pass Whale");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(auction.getStartTime()) || now.isAfter(auction.getEndTime())) {
            throw new IllegalStateException("L'enchère n'est pas active");
        }

        BigDecimal bidAmount = BigDecimal.valueOf(dto.getAmount());

        if (store.getBalance().compareTo(bidAmount) < 0) {
            throw new InsufficientBalanceException(
                "Solde insuffisant: disponible=" + store.getBalance() + ", requis=" + bidAmount
            );
        }

        Optional<Bid> highestOpt = repository.findTopByAuctionIdOrderByAmountDesc(dto.getAuctionId());
        BigDecimal startPrice = BigDecimal.valueOf(auction.getStartPrice());

        if (highestOpt.isEmpty()) {
            if (bidAmount.compareTo(startPrice) < 0) {
                throw new IllegalStateException("L'enchère doit être au moins à prix de départ: " + startPrice);
            }
        } else {
            Bid highest = highestOpt.get();
            BigDecimal highestAmount = BigDecimal.valueOf(highest.getAmount());

            if (bidAmount.compareTo(highestAmount) <= 0) {
                throw new IllegalStateException("L'enchère doit être supérieure à l'offre actuelle: " + highestAmount);
            }

            if (highest.getStore().getId().equals(store.getId())) {
                throw new IllegalStateException("Vous avez déjà l'offre la plus élevée");
            }

            Store oldStore = highest.getStore();
            oldStore.setBalance(oldStore.getBalance().add(highestAmount));
            oldStore.setReservedBalance(oldStore.getReservedBalance().subtract(highestAmount));
            storeRepository.save(oldStore);

            highest.setStatus(BidStatus.OUTBID);
            repository.save(highest);
        }

        store.setBalance(store.getBalance().subtract(bidAmount));
        store.setReservedBalance(store.getReservedBalance().add(bidAmount));
        storeRepository.save(store);

        Bid bid = mapper.toEntity(dto);
        bid.setStore(store);
        bid.setAuction(auction);
        bid.setTimestamp(LocalDateTime.now());
        bid.setStatus(BidStatus.WON);

        Bid saved = repository.save(bid);
        BidDto savedDto = mapper.toDto(saved);

        // Broadcast new bid to all dashboard watchers
        messagingTemplate.convertAndSend("/topic/bids", savedDto);

        // Notify new leading bidder of their updated balance
        messagingTemplate.convertAndSend(
            "/queue/store/" + store.getId() + "/balance",
            Map.of("balance", store.getBalance(), "reservedBalance", store.getReservedBalance())
        );

        // Notify outbid store of their refund
        highestOpt.ifPresent(outbidBid -> {
            Store outbidStore = outbidBid.getStore();
            messagingTemplate.convertAndSend(
                "/queue/store/" + outbidStore.getId() + "/balance",
                Map.of("balance", outbidStore.getBalance(), "reservedBalance", outbidStore.getReservedBalance())
            );
        });

        return savedDto;
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
        if (!auctionRepository.existsById(auctionId)) {
            throw new ResourceNotFoundException("Auction not found: " + auctionId);
        }
        return repository.findTopByAuctionIdOrderByAmountDesc(auctionId)
                .map(mapper::toDto);
    }

    public List<BidDto> getLeaderboardByAuction(Long auctionId) {
        if (!auctionRepository.existsById(auctionId)) {
            throw new ResourceNotFoundException("Auction not found: " + auctionId);
        }
        List<Bid> bids = repository.findLeaderboardByAuctionId(auctionId);
        return mapper.toDtoList(bids);
    }

    public List<BidDto> getGlobalLeaderboard() {
        List<Bid> bids = repository.findGlobalLeaderboard();
        return mapper.toDtoList(bids);
    }
}
