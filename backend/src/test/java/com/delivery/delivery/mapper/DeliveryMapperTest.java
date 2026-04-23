package com.delivery.delivery.mapper;

import com.delivery.delivery.dto.DeliveryDto;
import com.delivery.delivery.entity.Delivery;
import com.delivery.delivery.entity.DeliveryStatus;
import com.delivery.store.entity.Store;
import com.delivery.deliveryslot.entity.DeliverySlot;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DeliveryMapperTest {

    private final DeliveryMapper mapper = new DeliveryMapper();

    @Test
    void toDtoAndToEntity_roundtrip() {
        Store store = Store.builder()
                .id(1L)
                .name("TestStore")
                .build();

        DeliverySlot deliverySlot = DeliverySlot.builder()
                .id(1L)
                .build();

        Delivery delivery = Delivery.builder()
                .id(1L)
                .address("123 Test St")
                .status(DeliveryStatus.IN_PROGRESS)
                .deliveryCompany("UPS")
                .store(store)
                .deliverySlot(deliverySlot)
                .build();

        DeliveryDto dto = mapper.toDto(delivery);
        assertNotNull(dto);
        assertEquals(delivery.getId(), dto.getId());
        assertEquals(delivery.getAddress(), dto.getAddress());
        assertEquals(delivery.getStatus().name(), dto.getStatus());
        assertEquals(delivery.getDeliveryCompany(), dto.getDeliveryCompany());
        assertEquals(delivery.getStore().getId(), dto.getStoreId());
        assertEquals(delivery.getStore().getName(), dto.getStoreName());
        assertEquals(delivery.getDeliverySlot().getId(), dto.getDeliverySlotId());

        Delivery converted = mapper.toEntity(dto);
        assertNotNull(converted);
        assertEquals(dto.getId(), converted.getId());
        assertEquals(dto.getAddress(), converted.getAddress());
        assertEquals(dto.getDeliveryCompany(), converted.getDeliveryCompany());
        assertEquals(DeliveryStatus.IN_PROGRESS, converted.getStatus());
    }

    @Test
    void toEntity_nullStatusProducesNullStatus() {
        DeliveryDto dto = DeliveryDto.builder()
                .id(2L)
                .address("456 Delivery Ave")
                .status(null)
                .deliveryCompany("FedEx")
                .build();

        Delivery entity = mapper.toEntity(dto);
        assertNotNull(entity);
        assertNull(entity.getStatus());
    }

    @Test
    void toDto_nullEntityReturnsNull() {
        DeliveryDto dto = mapper.toDto(null);
        assertNull(dto);
    }

    @Test
    void toEntity_nullDtoReturnsNull() {
        Delivery entity = mapper.toEntity(null);
        assertNull(entity);
    }

    @Test
    void toEntity_nullStoreAndDeliverySlot() {
        DeliveryDto dto = DeliveryDto.builder()
                .id(3L)
                .address("789 Delivery Blvd")
                .status("PENDING")
                .deliveryCompany("DHL")
                .storeId(null)
                .deliverySlotId(null)
                .build();

        Delivery entity = mapper.toEntity(dto);
        assertNotNull(entity);
        assertNull(entity.getStore());
        assertNull(entity.getDeliverySlot());
        assertEquals(DeliveryStatus.PENDING, entity.getStatus());
    }

    @Test
    void toDtoList_convertsAll() {
        Store store = Store.builder().id(1L).name("Store1").build();
        DeliverySlot deliverySlot = DeliverySlot.builder().id(1L).build();

        Delivery delivery1 = Delivery.builder()
                .id(1L)
                .address("Address 1")
                .store(store)
                .deliverySlot(deliverySlot)
                .build();
        Delivery delivery2 = Delivery.builder()
                .id(2L)
                .address("Address 2")
                .store(store)
                .deliverySlot(deliverySlot)
                .build();

        var dtos = mapper.toDtoList(java.util.Arrays.asList(delivery1, delivery2));
        assertEquals(2, dtos.size());
        assertEquals(1L, dtos.get(0).getId());
        assertEquals(2L, dtos.get(1).getId());
    }

    @Test
    void toEntityList_convertsAll() {
        DeliveryDto dto1 = DeliveryDto.builder()
                .id(1L)
                .address("Address 1")
                .status("PENDING")
                .deliveryCompany("UPS")
                .build();
        DeliveryDto dto2 = DeliveryDto.builder()
                .id(2L)
                .address("Address 2")
                .status("DELIVERED")
                .deliveryCompany("FedEx")
                .build();

        var entities = mapper.toEntityList(java.util.Arrays.asList(dto1, dto2));
        assertEquals(2, entities.size());
        assertEquals(1L, entities.get(0).getId());
        assertEquals(2L, entities.get(1).getId());
        assertEquals(DeliveryStatus.PENDING, entities.get(0).getStatus());
        assertEquals(DeliveryStatus.DELIVERED, entities.get(1).getStatus());
    }

    @Test
    void toDto_withAllStatuses() {
        Store store = Store.builder().id(1L).name("TestStore").build();
        DeliverySlot deliverySlot = DeliverySlot.builder().id(1L).build();

        Delivery pendingDelivery = Delivery.builder()
                .id(1L)
                .address("Address 1")
                .status(DeliveryStatus.PENDING)
                .store(store)
                .deliverySlot(deliverySlot)
                .build();

        DeliveryDto pendingDto = mapper.toDto(pendingDelivery);
        assertEquals("PENDING", pendingDto.getStatus());

        Delivery inProgressDelivery = Delivery.builder()
                .id(2L)
                .address("Address 2")
                .status(DeliveryStatus.IN_PROGRESS)
                .store(store)
                .deliverySlot(deliverySlot)
                .build();

        DeliveryDto inProgressDto = mapper.toDto(inProgressDelivery);
        assertEquals("IN_PROGRESS", inProgressDto.getStatus());

        Delivery deliveredDelivery = Delivery.builder()
                .id(3L)
                .address("Address 3")
                .status(DeliveryStatus.DELIVERED)
                .store(store)
                .deliverySlot(deliverySlot)
                .build();

        DeliveryDto deliveredDto = mapper.toDto(deliveredDelivery);
        assertEquals("DELIVERED", deliveredDto.getStatus());

        Delivery cancelledDelivery = Delivery.builder()
                .id(4L)
                .address("Address 4")
                .status(DeliveryStatus.CANCELLED)
                .store(store)
                .deliverySlot(deliverySlot)
                .build();

        DeliveryDto cancelledDto = mapper.toDto(cancelledDelivery);
        assertEquals("CANCELLED", cancelledDto.getStatus());
    }
}
