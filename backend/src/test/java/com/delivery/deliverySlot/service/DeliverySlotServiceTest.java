package com.delivery.deliverySlot.service;

import com.delivery.deliverySlot.dto.DeliverySlotDto;
import com.delivery.deliverySlot.entity.DeliverySlot;
import com.delivery.deliverySlot.entity.DeliverySlotId;
import com.delivery.deliverySlot.entity.DeliverySlotStatus;
import com.delivery.deliverySlot.mapper.DeliverySlotMapper;
import com.delivery.deliverySlot.repository.DeliverySlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DeliverySlotServiceTest {

    @Mock
    private DeliverySlotRepository repository;

    private final DeliverySlotMapper mapper = new DeliverySlotMapper();

    private DeliverySlotService service;

    private static final LocalDateTime START = LocalDateTime.of(2024, 6, 1, 9, 0);
    private static final LocalDateTime END   = LocalDateTime.of(2024, 6, 1, 11, 0);

    @BeforeEach
    void setUp() {
        service = new DeliverySlotService(repository, mapper);
    }

    // ----------------------------------------------------------------- findAll

    @Test
    void findAll_returnsAllSlots() {
        DeliverySlot slot1 = DeliverySlot.builder()
                .technicalId(1L)
                .id(DeliverySlotId.builder().value("1").build())
                .startTime(START)
                .endTime(END)
                .capacity(10)
                .status(DeliverySlotStatus.OPEN)
                .build();

        DeliverySlot slot2 = DeliverySlot.builder()
                .technicalId(2L)
                .id(DeliverySlotId.builder().value("2").build())
                .startTime(START)
                .endTime(END)
                .capacity(5)
                .status(DeliverySlotStatus.PENDING)
                .build();

        when(repository.findAll()).thenReturn(Arrays.asList(slot1, slot2));

        List<DeliverySlotDto> result = service.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());
        verify(repository).findAll();
    }

    @Test
    void findAll_emptyList() {
        when(repository.findAll()).thenReturn(List.of());

        List<DeliverySlotDto> result = service.findAll();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ----------------------------------------------------------------- findById

    @Test
    void findById_found_returnsDto() {
        DeliverySlot slot = DeliverySlot.builder()
                .technicalId(1L)
                .id(DeliverySlotId.builder().value("1").build())
                .startTime(START)
                .endTime(END)
                .capacity(10)
                .status(DeliverySlotStatus.OPEN)
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(slot));

        DeliverySlotDto result = service.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(START, result.getStartTime());
        assertEquals(END, result.getEndTime());
        assertEquals(10, result.getCapacity());
        assertEquals(DeliverySlotStatus.OPEN, result.getStatus());
    }

    @Test
    void findById_notFound_returnsNull() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        DeliverySlotDto result = service.findById(99L);

        assertNull(result);
    }

    // ------------------------------------------------------------------ save

    @Test
    void save_persistsAndReturnsDto() {
        DeliverySlotDto inputDto = DeliverySlotDto.builder()
                .id(1L)
                .startTime(START)
                .endTime(END)
                .capacity(8)
                .status(DeliverySlotStatus.OPEN)
                .build();

        DeliverySlot savedEntity = DeliverySlot.builder()
                .technicalId(10L)
                .id(DeliverySlotId.builder().value("1").build())
                .startTime(START)
                .endTime(END)
                .capacity(8)
                .status(DeliverySlotStatus.OPEN)
                .build();

        when(repository.save(any(DeliverySlot.class))).thenReturn(savedEntity);

        DeliverySlotDto result = service.save(inputDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(8, result.getCapacity());
        assertEquals(DeliverySlotStatus.OPEN, result.getStatus());
        verify(repository).save(any(DeliverySlot.class));
    }

    @Test
    void save_withStatusPending() {
        DeliverySlotDto inputDto = DeliverySlotDto.builder()
                .id(2L)
                .startTime(START)
                .endTime(END)
                .capacity(3)
                .status(DeliverySlotStatus.PENDING)
                .build();

        DeliverySlot savedEntity = DeliverySlot.builder()
                .technicalId(20L)
                .id(DeliverySlotId.builder().value("2").build())
                .startTime(START)
                .endTime(END)
                .capacity(3)
                .status(DeliverySlotStatus.PENDING)
                .build();

        when(repository.save(any(DeliverySlot.class))).thenReturn(savedEntity);

        DeliverySlotDto result = service.save(inputDto);

        assertEquals(DeliverySlotStatus.PENDING, result.getStatus());
    }

    // ---------------------------------------------------------------- deleteById

    @Test
    void deleteById_callsRepository() {
        doNothing().when(repository).deleteById(1L);

        service.deleteById(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void deleteById_nonExistingId_doesNotThrow() {
        doNothing().when(repository).deleteById(999L);

        assertDoesNotThrow(() -> service.deleteById(999L));
        verify(repository).deleteById(999L);
    }
}
