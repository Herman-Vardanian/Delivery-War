package com.delivery.bid.repository;

import com.delivery.bid.entity.Bid;
import com.delivery.store.entity.Store;
import com.delivery.auction.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    
    List<Bid> findByStore(Store store);
    
    List<Bid> findByAuction(Auction auction);
    
    List<Bid> findByAuctionOrderByAmountDesc(Auction auction);
    
    List<Bid> findByAuctionIdOrderByAmountDesc(Long auctionId);
    
    Optional<Bid> findTopByAuctionOrderByAmountDesc(Auction auction);
    
    Optional<Bid> findTopByAuctionIdOrderByAmountDesc(Long auctionId);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.amount DESC")
    List<Bid> findBidsByAuctionIdOrderByAmountDesc(@Param("auctionId") Long auctionId);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.amount DESC")
    List<Bid> findLeaderboardByAuctionId(@Param("auctionId") Long auctionId);
    
    @Query("SELECT b FROM Bid b ORDER BY b.amount DESC")
    List<Bid> findGlobalLeaderboard();
}
