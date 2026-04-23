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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BidServiceTest {

    @Mock private BidRepository repository;
    @Mock private StoreRepository storeRepository;
    @Mock private AuctionRepository auctionRepository;
    @Mock private SimpMessagingTemplate messagingTemplate;

    private final BidMapper mapper = new BidMapper();
    private BidService service;

    @BeforeEach
    void setUp() {
        service = new BidService(repository, storeRepository, auctionRepository, mapper, messagingTemplate);
    }

    @Test
    void createBid_success() {
        Store store = Store.builder()
                .id(1L)
                .name("TestStore")
                .balance(BigDecimal.valueOf(500))
                .reservedBalance(BigDecimal.ZERO)
                .build();

        Auction auction = Auction.builder()
                .id(1L)
                .status(AuctionStatus.OPEN)
                .startPrice(50.0f)
                .startTime(LocalDateTime.now().minusMinutes(10))
                .endTime(LocalDateTime.now().plusMinutes(10))
                .build();

        BidDto dto = BidDto.builder()
                .amount(100.0)
                .storeId(1L)
                .auctionId(1L)
                .build();

        Bid savedEntity = Bid.builder()
                .id(1L)
                .amount(100.0)
                .status(BidStatus.WON)
                .store(store)
                .auction(auction)
                .timestamp(LocalDateTime.now())
                .build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(auctionRepository.findById(1L)).thenReturn(Optional.of(auction));
        when(repository.findTopByAuctionIdOrderByAmountDesc(1L)).thenReturn(Optional.empty());
        when(repository.save(any(Bid.class))).thenReturn(savedEntity);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));

        BidDto result = service.createBid(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(100.0, result.getAmount());
        verify(repository).save(any(Bid.class));
        verify(storeRepository).save(store);
        verify(messagingTemplate, atLeastOnce()).convertAndSend(anyString(), any(Object.class));
    }

    @Test
    void createBid_outbidsPreviousLeader() {
        Store oldLeader = Store.builder()
                .id(2L)
                .name("OldLeader")
                .balance(BigDecimal.valueOf(100))
                .reservedBalance(BigDecimal.valueOf(80))
                .build();

        Store newBidder = Store.builder()
                .id(1L)
                .name("NewBidder")
                .balance(BigDecimal.valueOf(500))
                .reservedBalance(BigDecimal.ZERO)
                .build();

        Auction auction = Auction.builder()
                .id(1L)
                .status(AuctionStatus.OPEN)
                .startPrice(50.0f)
                .startTime(LocalDateTime.now().minusMinutes(10))
                .endTime(LocalDateTime.now().plusMinutes(10))
                .build();

        Bid previousHighest = Bid.builder()
                .id(5L)
                .amount(80.0)
                .status(BidStatus.WON)
                .store(oldLeader)
                .auction(auction)
                .build();

        BidDto dto = BidDto.builder().amount(100.0).storeId(1L).auctionId(1L).build();

        Bid saved = Bid.builder().id(6L).amount(100.0).status(BidStatus.WON).store(newBidder).auction(auction).timestamp(LocalDateTime.now()).build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(newBidder));
        when(auctionRepository.findById(1L)).thenReturn(Optional.of(auction));
        when(repository.findTopByAuctionIdOrderByAmountDesc(1L)).thenReturn(Optional.of(previousHighest));
        when(repository.save(any(Bid.class))).thenReturn(saved);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));

        BidDto result = service.createBid(dto);

        assertNotNull(result);
        assertEquals(100.0, result.getAmount());
        // Old leader gets refunded (BigDecimal scale-insensitive comparison)
        assertEquals(0, oldLeader.getBalance().compareTo(BigDecimal.valueOf(180)));
        // New bidder has funds reserved
        assertEquals(0, newBidder.getBalance().compareTo(BigDecimal.valueOf(400)));
        verify(messagingTemplate, times(3)).convertAndSend(anyString(), any(Object.class));
    }

    @Test
    void createBid_notEnoughBalance_throws() {
        Store store = Store.builder()
                .id(1L)
                .balance(BigDecimal.valueOf(50))
                .reservedBalance(BigDecimal.ZERO)
                .build();

        Auction auction = Auction.builder()
                .id(1L)
                .status(AuctionStatus.OPEN)
                .startPrice(50.0f)
                .startTime(LocalDateTime.now().minusMinutes(10))
                .endTime(LocalDateTime.now().plusMinutes(10))
                .build();

        BidDto dto = BidDto.builder().amount(100.0).storeId(1L).auctionId(1L).build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(auctionRepository.findById(1L)).thenReturn(Optional.of(auction));

        assertThrows(InsufficientBalanceException.class, () -> service.createBid(dto));
    }

    @Test
    void createBid_auctionNotOpen_throws() {
        Store store = Store.builder().id(1L).balance(BigDecimal.valueOf(500)).reservedBalance(BigDecimal.ZERO).build();
        Auction auction = Auction.builder().id(1L).status(AuctionStatus.CLOSED)
                .startTime(LocalDateTime.now().minusHours(2))
                .endTime(LocalDateTime.now().minusHours(1)).build();
        BidDto dto = BidDto.builder().amount(100.0).storeId(1L).auctionId(1L).build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(auctionRepository.findById(1L)).thenReturn(Optional.of(auction));

        assertThrows(IllegalStateException.class, () -> service.createBid(dto));
    }

    @Test
    void createBid_storeNotFound_throws() {
        BidDto dto = BidDto.builder().amount(100.0).storeId(1L).auctionId(1L).build();
        when(storeRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.createBid(dto));
    }

    @Test
    void createBid_auctionNotFound_throws() {
        Store store = Store.builder().id(1L).balance(BigDecimal.valueOf(1000)).build();
        BidDto dto = BidDto.builder().amount(100.0).storeId(1L).auctionId(1L).build();
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
