package com.delivery.auction.mapper;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.entity.Auction;
import com.delivery.auction.entity.AuctionStatus;
import com.delivery.deliverySlot.entity.DeliverySlot;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class AuctionMapperTest {

    private final AuctionMapper mapper = new AuctionMapper();

    @Test
    void toDtoAndToEntity_roundtrip() {
        LocalDateTime start = LocalDateTime.of(2026, 4, 23, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 4, 23, 11, 0);

        DeliverySlot slot = DeliverySlot.builder()
                .id(1L)
                .build();

        Auction a = Auction.builder()
                .id(1L)
                .startPrice(12.5f)
                .startTime(start)
                .endTime(end)
                .status(AuctionStatus.OPEN)
                .deliverySlot(slot)
                .build();

        AuctionDto dto = mapper.toDto(a);

        assertNotNull(dto);
        assertEquals(a.getId(), dto.getId());
        assertEquals(a.getStartPrice(), dto.getStartPrice());
        assertEquals(a.getStartTime().toString(), dto.getStartTime());
        assertEquals(a.getEndTime().toString(), dto.getEndTime());
        assertEquals(a.getStatus(), dto.getStatus());
        assertEquals(1L, dto.getDeliverySlotId());

        DeliverySlot slotFromDto = DeliverySlot.builder()
                .id(dto.getDeliverySlotId())
                .build();

        Auction converted = mapper.toEntity(dto, slotFromDto);

        assertNotNull(converted);
        assertEquals(dto.getId(), converted.getId());
        assertEquals(dto.getStartPrice(), converted.getStartPrice());
        assertEquals(dto.getStatus(), converted.getStatus());
        assertEquals(1L, converted.getDeliverySlot().getId());
    }

    @Test
    void toDto_nullReturnsNull() {
        assertNull(mapper.toDto(null));
    }

    @Test
    void toEntity_nullReturnsNull() {
        assertNull(mapper.toEntity(null, null));
    }
}
