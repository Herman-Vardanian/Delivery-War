package com.delivery.auction.scheduler;

import com.delivery.auction.entity.Auction;
import com.delivery.auction.entity.AuctionStatus;
import com.delivery.auction.repository.AuctionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;

    public AuctionScheduler(AuctionRepository auctionRepository) {
        this.auctionRepository = auctionRepository;
    }

    @Scheduled(fixedDelay = 15000)
    @Transactional
    public void transitionAuctions() {
        LocalDateTime now = LocalDateTime.now();

        List<Auction> toOpen = auctionRepository.findByStatusAndStartTimeLessThanEqual(AuctionStatus.PENDING, now);
        toOpen.forEach(a -> a.setStatus(AuctionStatus.OPEN));
        if (!toOpen.isEmpty()) auctionRepository.saveAll(toOpen);

        List<Auction> toClose = auctionRepository.findByStatusAndEndTimeLessThan(AuctionStatus.OPEN, now);
        toClose.forEach(a -> a.setStatus(AuctionStatus.CLOSED));
        if (!toClose.isEmpty()) auctionRepository.saveAll(toClose);
    }
}
