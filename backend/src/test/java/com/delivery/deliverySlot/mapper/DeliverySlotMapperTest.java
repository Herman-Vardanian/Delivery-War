package com.delivery.deliverySlot.mapper;

import com.delivery.deliverySlot.dto.DeliverySlotDto;
import com.delivery.deliverySlot.entity.DeliverySlot;
import com.delivery.deliverySlot.entity.DeliverySlotStatus;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class DeliverySlotMapperTest {

    private final DeliverySlotMapper mapper = new DeliverySlotMapper();

    private static final LocalDateTime START = LocalDateTime.of(2024, 6, 1, 9, 0);
    private static final LocalDateTime END = LocalDateTime.of(2024, 6, 1, 11, 0);

    @Test
    void toDto_nullEntityReturnsNull() {
        assertNull(mapper.toDto(null));
    }

    @Test
    void toDto_mapsAllFields() {
        DeliverySlot entity = DeliverySlot.builder()
                .id(1L)
                .startTime(START)
                .endTime(END)
                .capacity(10)
                .status(DeliverySlotStatus.OPEN)
                .build();

        DeliverySlotDto dto = mapper.toDto(entity);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals(START.toString(), dto.getStartTime());
        assertEquals(END.toString(), dto.getEndTime());
        assertEquals(10, dto.getCapacity());
        assertEquals(DeliverySlotStatus.OPEN, dto.getStatus());
    }

    @Test
    void toDto_statusPending() {
        DeliverySlot entity = DeliverySlot.builder()
                .id(2L)
                .startTime(START)
                .endTime(END)
                .capacity(5)
                .status(DeliverySlotStatus.PENDING)
                .build();

        DeliverySlotDto dto = mapper.toDto(entity);

        assertEquals(DeliverySlotStatus.PENDING, dto.getStatus());
        assertEquals(2L, dto.getId());
    }

    @Test
    void toDto_statusClosed() {
        DeliverySlot entity = DeliverySlot.builder()
                .id(3L)
                .startTime(START)
                .endTime(END)
                .capacity(0)
                .status(DeliverySlotStatus.CLOSED)
                .build();

        DeliverySlotDto dto = mapper.toDto(entity);

        assertEquals(DeliverySlotStatus.CLOSED, dto.getStatus());
        assertEquals(3L, dto.getId());
    }

    @Test
    void toEntity_nullDtoReturnsNull() {
        assertNull(mapper.toEntity(null));
    }

    @Test
    void toEntity_mapsAllFields() {
        DeliverySlotDto dto = DeliverySlotDto.builder()
                .id(7L)
                .startTime(START.toString())
                .endTime(END.toString())
                .capacity(20)
                .status(DeliverySlotStatus.OPEN)
                .build();

        DeliverySlot entity = mapper.toEntity(dto);

        assertNotNull(entity);
        assertEquals(7L, entity.getId());
        assertEquals(START, entity.getStartTime());
        assertEquals(END, entity.getEndTime());
        assertEquals(20, entity.getCapacity());
        assertEquals(DeliverySlotStatus.OPEN, entity.getStatus());
    }

    @Test
    void toEntity_nullCapacityAndStatus() {
        DeliverySlotDto dto = DeliverySlotDto.builder()
                .id(5L)
                .startTime(START.toString())
                .endTime(END.toString())
                .capacity(null)
                .status(null)
                .build();

        DeliverySlot entity = mapper.toEntity(dto);

        assertNotNull(entity);
        assertNull(entity.getCapacity());
        assertNull(entity.getStatus());
    }

    @Test
    void roundtrip_dtoToEntityToDto() {
        DeliverySlotDto original = DeliverySlotDto.builder()
                .id(9L)
                .startTime(START.toString())
                .endTime(END.toString())
                .capacity(15)
                .status(DeliverySlotStatus.OPEN)
                .build();

        DeliverySlot entity = mapper.toEntity(original);
        DeliverySlotDto converted = mapper.toDto(entity);

        assertNotNull(converted);
        assertEquals(original.getId(), converted.getId());
        assertEquals(original.getStartTime(), converted.getStartTime());
        assertEquals(original.getEndTime(), converted.getEndTime());
        assertEquals(original.getCapacity(), converted.getCapacity());
        assertEquals(original.getStatus(), converted.getStatus());
    }
}
