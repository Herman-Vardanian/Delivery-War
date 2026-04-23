package com.delivery.store.mapper;

import com.delivery.store.dto.StoreDto;
import com.delivery.store.entity.Role;
import com.delivery.store.entity.Store;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class StoreMapper {

    public StoreDto toDto(Store s) {
        if (s == null)
            return null;
        return StoreDto.builder()
                .id(s.getId())
                .name(s.getName())
                .password(s.getPassword())
                .role(s.getRole() != null ? s.getRole().name() : null)
                .balance(s.getBalance())
                .reservedBalance(s.getReservedBalance())
                .totalSpent(s.getTotalSpent())
                .whalePass(s.getWhalePass())
                .passId(s.getPassId())
                .build();
    }

    public Store toEntity(StoreDto d) {
        if (d == null)
            return null;
        Store s = Store.builder()
                .id(d.getId())
                .name(d.getName())
                .password(d.getPassword())
                .balance(defaultZero(d.getBalance()))
                .reservedBalance(defaultZero(d.getReservedBalance()))
                .totalSpent(defaultZero(d.getTotalSpent()))
                .whalePass(d.getWhalePass())
                .passId(d.getPassId())
                .build();
        if (d.getRole() != null) {
            try {
                s.setRole(Role.valueOf(d.getRole()));
            } catch (IllegalArgumentException ex) {
                s.setRole(null);
            }
        }
        return s;
    }

    private java.math.BigDecimal defaultZero(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
