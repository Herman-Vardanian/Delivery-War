package com.delivery.auction.scheduler;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.entity.Auction;
import com.delivery.auction.entity.AuctionStatus;
import com.delivery.auction.mapper.AuctionMapper;
import com.delivery.auction.repository.AuctionRepository;
import com.delivery.bid.entity.Bid;
import com.delivery.bid.repository.BidRepository;
import com.delivery.store.entity.Store;
import com.delivery.store.repository.StoreRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final AuctionMapper auctionMapper;
    private final BidRepository bidRepository;
    private final StoreRepository storeRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AuctionScheduler(AuctionRepository auctionRepository,
                            AuctionMapper auctionMapper,
                            BidRepository bidRepository,
                            StoreRepository storeRepository,
                            SimpMessagingTemplate messagingTemplate) {
        this.auctionRepository = auctionRepository;
        this.auctionMapper = auctionMapper;
        this.bidRepository = bidRepository;
        this.storeRepository = storeRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Scheduled(fixedDelay = 15000)
    @Transactional
    public void transitionAuctions() {
        LocalDateTime now = LocalDateTime.now();

        List<Auction> toOpen = auctionRepository.findByStatusAndStartTimeLessThanEqual(AuctionStatus.PENDING, now);
        toOpen.forEach(a -> a.setStatus(AuctionStatus.OPEN));
        if (!toOpen.isEmpty()) auctionRepository.saveAll(toOpen);

        List<Auction> toClose = auctionRepository.findByStatusAndEndTimeLessThan(AuctionStatus.OPEN, now);
        toClose.forEach(auction -> {
            auction.setStatus(AuctionStatus.CLOSED);
            settleAuction(auction);
        });
        if (!toClose.isEmpty()) auctionRepository.saveAll(toClose);

        if (!toOpen.isEmpty() || !toClose.isEmpty()) {
            List<AuctionDto> allAuctions = auctionRepository.findAll()
                    .stream()
                    .map(auctionMapper::toDto)
                    .toList();
            messagingTemplate.convertAndSend("/topic/auctions", allAuctions);
        }
    }

    // When an auction closes, transfer reservedBalance to totalSpent for the winner.
    private void settleAuction(Auction auction) {
        Optional<Bid> winningBid = bidRepository.findTopByAuctionIdOrderByAmountDesc(auction.getId());
        winningBid.ifPresent(bid -> {
            Store winner = bid.getStore();
            BigDecimal amount = BigDecimal.valueOf(bid.getAmount());

            winner.setReservedBalance(winner.getReservedBalance().subtract(amount));
            winner.setTotalSpent(
                    (winner.getTotalSpent() != null ? winner.getTotalSpent() : BigDecimal.ZERO).add(amount)
            );
            storeRepository.save(winner);

            messagingTemplate.convertAndSend(
                    "/queue/store/" + winner.getId() + "/balance",
                    Map.of(
                            "balance", winner.getBalance(),
                            "reservedBalance", winner.getReservedBalance(),
                            "totalSpent", winner.getTotalSpent()
                    )
            );
        });
    }
}
