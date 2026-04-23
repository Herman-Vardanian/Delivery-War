package com.delivery.auction.service;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.entity.Auction;
import com.delivery.auction.entity.AuctionStatus;
import com.delivery.auction.mapper.AuctionMapper;
import com.delivery.auction.repository.AuctionRepository;
import com.delivery.common.exception.ResourceNotFoundException;
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
public class AuctionServiceTest {

    @Mock
    private AuctionRepository repository;

    private final AuctionMapper mapper = new AuctionMapper();

    private AuctionService service;

    @BeforeEach
    void setUp() {
        service = new AuctionService(repository, mapper);
    }

    @Test
    void createAuction_savesAndReturnsDto() {
        AuctionDto dto = AuctionDto.builder()
                .startPrice(10.0f)
                .startTime(LocalDateTime.of(2026, 4, 23, 10, 0).toString())
                .endTime(LocalDateTime.of(2026, 4, 23, 11, 0).toString())
                .status(AuctionStatus.OPEN)
                .build();

        Auction savedEntity = Auction.builder()
                .id(1L)
                .startPrice(10.0f)
                .startTime(LocalDateTime.parse(dto.getStartTime()))
                .endTime(LocalDateTime.parse(dto.getEndTime()))
                .status(AuctionStatus.OPEN)
                .build();

        when(repository.save(any(Auction.class))).thenReturn(savedEntity);

        AuctionDto result = service.createAuction(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(10.0f, result.getStartPrice());
        assertEquals(AuctionStatus.OPEN, result.getStatus());
        verify(repository).save(any(Auction.class));
    }

    @Test
    void getAuction_found() {
        Auction a = Auction.builder().id(2L).startPrice(20.0f).status(AuctionStatus.OPEN)
                .startTime(LocalDateTime.of(2026, 4, 23, 10, 0))
                .endTime(LocalDateTime.of(2026, 4, 23, 11, 0))
                .build();
        when(repository.findById(2L)).thenReturn(Optional.of(a));

        AuctionDto dto = service.getAuction(2L);

        assertNotNull(dto);
        assertEquals(2L, dto.getId());
        assertEquals(20.0f, dto.getStartPrice());
    }

    @Test
    void getAuction_notFound() {
        when(repository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getAuction(100L));
    }

    @Test
    void listAuctions_returnsAll() {
        Auction a = Auction.builder().id(1L).startPrice(10.0f).startTime(LocalDateTime.of(2026, 4, 23, 10, 0))
                .endTime(LocalDateTime.of(2026, 4, 23, 11, 0)).status(AuctionStatus.OPEN).build();
        Auction b = Auction.builder().id(2L).startPrice(20.0f).startTime(LocalDateTime.of(2026, 4, 23, 10, 0))
                .endTime(LocalDateTime.of(2026, 4, 23, 11, 0)).status(AuctionStatus.OPEN).build();
        when(repository.findAll()).thenReturn(Arrays.asList(a, b));

        var list = service.listAuctions();

        assertEquals(2, list.size());
        assertEquals(1L, list.get(0).getId());
        assertEquals(2L, list.get(1).getId());
    }

    @Test
    void updateAuction_updatesFields() {
        Auction existing = Auction.builder()
                .id(3L)
                .startPrice(5.0f)
                .status(AuctionStatus.OPEN)
                .build();

        when(repository.findById(3L)).thenReturn(Optional.of(existing));

        Auction saved = Auction.builder()
                .id(3L)
                .startPrice(99.9f)
                .status(AuctionStatus.CLOSED)
                .build();

        when(repository.save(any(Auction.class))).thenReturn(saved);

        AuctionDto dto = AuctionDto.builder()
                .startPrice(99.9f)
                .startTime(LocalDateTime.of(2026, 4, 23, 10, 0).toString())
                .endTime(LocalDateTime.of(2026, 4, 23, 11, 0).toString())
                .deliverySlotId("1")
                .status(AuctionStatus.CLOSED)
                .build();

        AuctionDto result = service.updateAuction(3L, dto);

        assertEquals(99.9f, result.getStartPrice());
        assertEquals(AuctionStatus.CLOSED, result.getStatus());
        verify(repository).save(existing);
    }
}