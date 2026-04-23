package com.delivery.store.service;

import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.store.dto.StoreDto;
import com.delivery.store.entity.Role;
import com.delivery.store.entity.Store;
import com.delivery.store.mapper.StoreMapper;
import com.delivery.store.repository.StoreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StoreServiceTest {

    @Mock
    private StoreRepository repository;

    private StoreMapper mapper = new StoreMapper();

    private StoreService service;

    @BeforeEach
    void setUp() {
        service = new StoreService(repository, mapper);
    }

    @Test
    void createStore_setsDefaultsAndSaves() {
        StoreDto dto = StoreDto.builder().name("S1").role("STORE").build();

        Store savedEntity = Store.builder()
                .id(1L)
                .name("S1")
                .role(Role.STORE)
                .balance(BigDecimal.ZERO)
                .reservedBalance(BigDecimal.ZERO)
                .totalSpent(BigDecimal.ZERO)
                .build();

        when(repository.save(any(Store.class))).thenReturn(savedEntity);

        StoreDto result = service.createStore(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(BigDecimal.ZERO, result.getBalance());
        assertEquals(BigDecimal.ZERO, result.getReservedBalance());
    }

    @Test
    void getStore_found() {
        Store s = Store.builder().id(2L).name("S2").build();
        when(repository.findById(2L)).thenReturn(Optional.of(s));

        StoreDto dto = service.getStore(2L);
        assertNotNull(dto);
        assertEquals(2L, dto.getId());
    }

    @Test
    void getStore_notFound() {
        when(repository.findById(100L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getStore(100L));
    }

    @Test
    void listStores_returnsAll() {
        Store a = Store.builder().id(1L).name("A").build();
        Store b = Store.builder().id(2L).name("B").build();
        when(repository.findAll()).thenReturn(Arrays.asList(a, b));

        var list = service.listStores();
        assertEquals(2, list.size());
    }

    @Test
    void updateStore_updatesFields() {
        Store existing = Store.builder()
                .id(3L)
                .name("Old")
                .balance(BigDecimal.ZERO)
                .reservedBalance(BigDecimal.ZERO)
                .totalSpent(BigDecimal.ZERO)
                .build();
        when(repository.findById(3L)).thenReturn(Optional.of(existing));

        Store saved = Store.builder()
                .id(3L)
                .name("New")
                .balance(BigDecimal.valueOf(100))
                .reservedBalance(BigDecimal.ZERO)
                .totalSpent(BigDecimal.ZERO)
                .build();
        when(repository.save(any(Store.class))).thenReturn(saved);

        StoreDto dto = StoreDto.builder().name("New").balance(BigDecimal.valueOf(100)).build();
        StoreDto result = service.updateStore(3L, dto);

        assertEquals("New", result.getName());
        assertEquals(BigDecimal.valueOf(100), result.getBalance());
    }

    @Test
    void deleteStore_successAndVerifyDeleteCalled() {
        Store existing = Store.builder()
                .id(4L)
                .balance(BigDecimal.ZERO)
                .reservedBalance(BigDecimal.ZERO)
                .totalSpent(BigDecimal.ZERO)
                .build();
        when(repository.findById(4L)).thenReturn(Optional.of(existing));

        service.deleteStore(4L);

        verify(repository).delete(existing);
    }

    @Test
    void deleteStore_withReservedBalance_throws() {
        Store existing = Store.builder()
                .id(5L)
                .reservedBalance(BigDecimal.valueOf(10))
                .balance(BigDecimal.ZERO)
                .build();
        when(repository.findById(5L)).thenReturn(Optional.of(existing));

        assertThrows(IllegalArgumentException.class, () -> service.deleteStore(5L));
    }
}
