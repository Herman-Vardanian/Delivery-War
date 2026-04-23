package com.delivery.bid.repository;

import com.delivery.bid.entity.Bid;
import com.delivery.store.entity.Store;
import com.delivery.auction.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    
    List<Bid> findByStore(Store store);
    
    List<Bid> findByAuction(Auction auction);
    
    List<Bid> findByAuctionOrderByAmountDesc(Auction auction);
    
    Optional<Bid> findTopByAuctionOrderByAmountDesc(Auction auction);
}
