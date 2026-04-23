package com.delivery.auction.repository;

import com.delivery.auction.entity.Auction;
import com.delivery.auction.entity.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {

    List<Auction> findByStatusAndStartTimeLessThanEqual(AuctionStatus status, LocalDateTime time);

    List<Auction> findByStatusAndEndTimeLessThan(AuctionStatus status, LocalDateTime time);
}