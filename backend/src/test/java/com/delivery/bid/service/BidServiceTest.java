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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BidServiceTest {

    @Mock
    private BidRepository repository;

    @Mock
    private StoreRepository storeRepository;

    @Mock
    private AuctionRepository auctionRepository;

    private BidMapper mapper = new BidMapper();

    private BidService service;

    @BeforeEach
    void setUp() {
        service = new BidService(repository, storeRepository, auctionRepository, mapper);
    }

    @Test
    void createBid_setsDefaultsAndSaves() {
        Store store = Store.builder().id(1L).name("TestStore").build();
        Auction auction = Auction.builder().id(1L).build();

        BidDto dto = BidDto.builder()
                .amount(100.0)
                .storeId(1L)
                .auctionId(1L)
                .build();

        Bid savedEntity = Bid.builder()
                .id(1L)
                .amount(100.0)
                .timestamp(LocalDateTime.now())
                .status(BidStatus.OUTBID)
                .store(store)
                .auction(auction)
                .build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(auctionRepository.findById(1L)).thenReturn(Optional.of(auction));
        when(repository.save(any(Bid.class))).thenReturn(savedEntity);

        BidDto result = service.createBid(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(100.0, result.getAmount());
        assertEquals("OUTBID", result.getStatus());
        verify(repository).save(any(Bid.class));
    }

    @Test
    void createBid_storeNotFound_throws() {
        BidDto dto = BidDto.builder()
                .amount(100.0)
                .storeId(1L)
                .auctionId(1L)
                .build();

        when(storeRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.createBid(dto));
    }

    @Test
    void createBid_auctionNotFound_throws() {
        Store store = Store.builder().id(1L).name("TestStore").build();
        BidDto dto = BidDto.builder()
                .amount(100.0)
                .storeId(1L)
                .auctionId(1L)
                .build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(auctionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.createBid(dto));
    }

    @Test
    void getBid_found() {
        Bid bid = Bid.builder().id(2L).amount(150.0).build();
        when(repository.findById(2L)).thenReturn(Optional.of(bid));

        BidDto dto = service.getBid(2L);
        assertNotNull(dto);
        assertEquals(2L, dto.getId());
        assertEquals(150.0, dto.getAmount());
    }

    @Test
    void getBid_notFound() {
        when(repository.findById(100L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getBid(100L));
    }

    @Test
    void listBids_returnsAll() {
        Bid a = Bid.builder().id(1L).amount(100.0).build();
        Bid b = Bid.builder().id(2L).amount(200.0).build();
        when(repository.findAll()).thenReturn(Arrays.asList(a, b));

        var list = service.listBids();
        assertEquals(2, list.size());
    }

     @Test
     void getBidsByAuction_returnsList() {
         Auction auction = Auction.builder().id(1L).build();
         Bid a = Bid.builder().id(1L).amount(100.0).auction(auction).build();
         Bid b = Bid.builder().id(2L).amount(200.0).auction(auction).build();

         when(auctionRepository.existsById(1L)).thenReturn(true);
         when(repository.findBidsByAuctionIdOrderByAmountDesc(1L)).thenReturn(Arrays.asList(a, b));

         var list = service.getBidsByAuction(1L);
         assertEquals(2, list.size());
     }

    @Test
    void getBidsByStore_returnsList() {
        Store store = Store.builder().id(1L).build();
        Bid a = Bid.builder().id(1L).amount(100.0).store(store).build();
        Bid b = Bid.builder().id(2L).amount(200.0).store(store).build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(repository.findByStore(store)).thenReturn(Arrays.asList(a, b));

        var list = service.getBidsByStore(1L);
        assertEquals(2, list.size());
    }

     @Test
     void getHighestBid_found() {
         Auction auction = Auction.builder().id(1L).build();
         Bid highest = Bid.builder().id(3L).amount(500.0).auction(auction).build();

         when(auctionRepository.existsById(1L)).thenReturn(true);
         when(repository.findTopByAuctionIdOrderByAmountDesc(1L)).thenReturn(Optional.of(highest));

         Optional<BidDto> result = service.getHighestBid(1L);
         assertTrue(result.isPresent());
         assertEquals(3L, result.get().getId());
         assertEquals(500.0, result.get().getAmount());
     }

     @Test
     void getHighestBid_notFound() {

         when(auctionRepository.existsById(1L)).thenReturn(true);
         when(repository.findTopByAuctionIdOrderByAmountDesc(1L)).thenReturn(Optional.empty());

         Optional<BidDto> result = service.getHighestBid(1L);
         assertFalse(result.isPresent());
     }
}
