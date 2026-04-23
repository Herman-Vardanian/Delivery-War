package com.delivery.auction.mapper;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.entity.Auction;
import com.delivery.auction.entity.AuctionStatus;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class AuctionMapperTest {

    private final AuctionMapper mapper = new AuctionMapper();

    @Test
    void toDtoAndToEntity_roundtrip() {
        LocalDateTime start = LocalDateTime.of(2026, 4, 23, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 4, 23, 11, 0);

        Auction a = Auction.builder()
                .id(1L)
                .startPrice(12.5f)
                .startTime(start)
                .endTime(end)
                .status(AuctionStatus.OPEN)
                .build();

        AuctionDto dto = mapper.toDto(a);
        assertNotNull(dto);
        assertEquals(a.getId(), dto.getId());
        assertEquals(a.getStartPrice(), dto.getStartPrice());
        assertEquals(a.getStartTime().toString(), dto.getStartTime());
        assertEquals(a.getEndTime().toString(), dto.getEndTime());
        assertEquals(a.getStatus(), dto.getStatus());

        Auction converted = mapper.toEntity(dto);
        assertNotNull(converted);
        assertEquals(dto.getId(), converted.getId());
        assertEquals(dto.getStartPrice(), converted.getStartPrice());
        assertEquals(dto.getStartTime().toString(), converted.getStartTime().toString());
        assertEquals(dto.getEndTime().toString(), converted.getEndTime().toString());
        assertEquals(dto.getStatus(), converted.getStatus());
    }

    @Test
    void toDto_nullReturnsNull() {
        assertNull(mapper.toDto(null));
    }

    @Test
    void toEntity_nullReturnsNull() {
        assertNull(mapper.toEntity(null));
    }
}