package com.delivery.delivery.service;

import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.delivery.dto.DeliveryDto;
import com.delivery.delivery.entity.Delivery;
import com.delivery.delivery.entity.DeliveryStatus;
import com.delivery.delivery.mapper.DeliveryMapper;
import com.delivery.delivery.repository.DeliveryRepository;
import com.delivery.store.entity.Store;
import com.delivery.store.repository.StoreRepository;
import com.delivery.deliverySlot.entity.DeliverySlot;
import com.delivery.deliverySlot.repository.DeliverySlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DeliveryServiceTest {

    @Mock
    private DeliveryRepository repository;

    @Mock
    private StoreRepository storeRepository;

    @Mock
    private DeliverySlotRepository deliverySlotRepository;

    private DeliveryMapper mapper = new DeliveryMapper();

    private DeliveryService service;

    @BeforeEach
    void setUp() {
        service = new DeliveryService(repository, storeRepository, deliverySlotRepository, mapper);
    }

    @Test
    void createDelivery_setsDefaultsAndSaves() {
        Store store = Store.builder().id(1L).name("TestStore").build();
        DeliverySlot deliverySlot = DeliverySlot.builder().id(1L).build();

        DeliveryDto dto = DeliveryDto.builder()
                .address("123 Test St")
                .deliveryCompany("UPS")
                .storeId(1L)
                .deliverySlotId(1L)
                .build();

        Delivery savedEntity = Delivery.builder()
                .id(1L)
                .address("123 Test St")
                .status(DeliveryStatus.PENDING)
                .deliveryCompany("UPS")
                .store(store)
                .deliverySlot(deliverySlot)
                .build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(deliverySlotRepository.findById(1L)).thenReturn(Optional.of(deliverySlot));
        when(repository.save(any(Delivery.class))).thenReturn(savedEntity);

        DeliveryDto result = service.createDelivery(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("123 Test St", result.getAddress());
        assertEquals("PENDING", result.getStatus());
        assertEquals("UPS", result.getDeliveryCompany());
        verify(repository).save(any(Delivery.class));
    }

    @Test
    void createDelivery_storeNotFound_throws() {
        DeliveryDto dto = DeliveryDto.builder()
                .address("123 Test St")
                .deliveryCompany("UPS")
                .storeId(1L)
                .deliverySlotId(1L)
                .build();

        when(storeRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.createDelivery(dto));
    }

    @Test
    void createDelivery_deliverySlotNotFound_throws() {
        Store store = Store.builder().id(1L).name("TestStore").build();
        DeliveryDto dto = DeliveryDto.builder()
                .address("123 Test St")
                .deliveryCompany("UPS")
                .storeId(1L)
                .deliverySlotId(1L)
                .build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(deliverySlotRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.createDelivery(dto));
    }

    @Test
    void getDelivery_found() {
        Delivery delivery = Delivery.builder()
                .id(2L)
                .address("456 Delivery Ave")
                .status(DeliveryStatus.IN_PROGRESS)
                .build();
        when(repository.findById(2L)).thenReturn(Optional.of(delivery));

        DeliveryDto dto = service.getDelivery(2L);
        assertNotNull(dto);
        assertEquals(2L, dto.getId());
        assertEquals("456 Delivery Ave", dto.getAddress());
        assertEquals("IN_PROGRESS", dto.getStatus());
    }

    @Test
    void getDelivery_notFound() {
        when(repository.findById(100L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getDelivery(100L));
    }

    @Test
    void listDeliveries_returnsAll() {
        Delivery a = Delivery.builder().id(1L).address("Address A").build();
        Delivery b = Delivery.builder().id(2L).address("Address B").build();
        when(repository.findAll()).thenReturn(Arrays.asList(a, b));

        var list = service.listDeliveries();
        assertEquals(2, list.size());
    }

    @Test
    void getDeliveriesByStore_returnsList() {
        Store store = Store.builder().id(1L).build();
        Delivery a = Delivery.builder().id(1L).address("Address A").store(store).build();
        Delivery b = Delivery.builder().id(2L).address("Address B").store(store).build();

        when(storeRepository.findById(1L)).thenReturn(Optional.of(store));
        when(repository.findByStore(store)).thenReturn(Arrays.asList(a, b));

        var list = service.getDeliveriesByStore(1L);
        assertEquals(2, list.size());
    }

    @Test
    void getDeliveriesByDeliverySlot_returnsList() {
        DeliverySlot deliverySlot = DeliverySlot.builder().id(1L).build();
        Delivery a = Delivery.builder().id(1L).address("Address A").deliverySlot(deliverySlot).build();
        Delivery b = Delivery.builder().id(2L).address("Address B").deliverySlot(deliverySlot).build();

        when(deliverySlotRepository.findById(1L)).thenReturn(Optional.of(deliverySlot));
        when(repository.findByDeliverySlot(deliverySlot)).thenReturn(Arrays.asList(a, b));

        var list = service.getDeliveriesByDeliverySlot(1L);
        assertEquals(2, list.size());
    }

    @Test
    void getDeliveriesByStore_storeNotFound_throws() {
        when(storeRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getDeliveriesByStore(1L));
    }

    @Test
    void getDeliveriesByDeliverySlot_deliverySlotNotFound_throws() {
        when(deliverySlotRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getDeliveriesByDeliverySlot(1L));
    }
}
