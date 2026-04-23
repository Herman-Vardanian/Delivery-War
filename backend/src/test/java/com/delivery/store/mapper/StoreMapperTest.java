package com.delivery.store.mapper;

import com.delivery.store.dto.StoreDto;
import com.delivery.store.entity.Role;
import com.delivery.store.entity.Store;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class StoreMapperTest {

    private final StoreMapper mapper = new StoreMapper();

    @Test
    void toDtoAndToEntity_roundtrip() {
        Store s = Store.builder()
                .id(1L)
                .name("Shop")
                .password("pwd")
                .role(Role.STORE)
                .balance(new BigDecimal("10.50"))
                .reservedBalance(new BigDecimal("2.00"))
                .totalSpent(new BigDecimal("100.00"))
                .whalePass(Boolean.TRUE)
                .passId(123L)
                .build();

        StoreDto dto = mapper.toDto(s);
        assertNotNull(dto);
        assertEquals(s.getId(), dto.getId());
        assertEquals(s.getName(), dto.getName());
        assertEquals(s.getPassword(), dto.getPassword());
        assertEquals(s.getRole().name(), dto.getRole());
        assertEquals(s.getBalance(), dto.getBalance());
        assertEquals(s.getReservedBalance(), dto.getReservedBalance());
        assertEquals(s.getTotalSpent(), dto.getTotalSpent());
        assertEquals(s.getWhalePass(), dto.getWhalePass());
        assertEquals(s.getPassId(), dto.getPassId());

        Store converted = mapper.toEntity(dto);
        assertNotNull(converted);
        assertEquals(dto.getId(), converted.getId());
        assertEquals(dto.getName(), converted.getName());
        assertEquals(dto.getPassword(), converted.getPassword());
        assertEquals(Role.STORE, converted.getRole());
    }

    @Test
    void toEntity_invalidRoleProducesNullRole() {
        StoreDto dto = StoreDto.builder()
                .id(2L)
                .name("BadRoleShop")
                .role("INVALID_ROLE")
                .build();

        Store e = mapper.toEntity(dto);
        assertNotNull(e);
        assertNull(e.getRole());
    }

    @Test
    void toEntity_nullBalancesBecomeZero() {
        StoreDto dto = StoreDto.builder()
                .id(3L)
                .name("NoBalances")
                .build();

        Store e = mapper.toEntity(dto);
        assertEquals(BigDecimal.ZERO, e.getBalance());
        assertEquals(BigDecimal.ZERO, e.getReservedBalance());
        assertEquals(BigDecimal.ZERO, e.getTotalSpent());
    }
}
